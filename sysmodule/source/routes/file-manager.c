#include <stdio.h>
#include <unistd.h>
#include <switch.h>
#include <mongoose/mongoose.h>
#include <json-c/json.h>

void event_handler_file_manager_list_directory_contents(struct mg_connection *c, int event, void *p)
{
    struct http_message *hm = (struct http_message *) p;
    struct json_object *parsed_json;
    struct json_object *json_path;
    const char *path;

    parsed_json = json_tokener_parse(hm->body.p);
    json_object_object_get_ex(parsed_json, "path", &json_path);
    path = json_object_get_string(json_path);

    DIR *dir;
    dir = opendir(path);

    if (dir == NULL) {
        // *INDENT-OFF*
        char message[] = (
            "{"
                "\"status\": \"error\","
                "\"message\": \"Directory does not exist\""
            "}"
        );
        // *INDENT-ON*
        mg_send_head(c, 400, strlen(message), "Content-Type: application/json");
        mg_send(c, message, strlen(message));

        return;
    }

    struct json_object *json_return_array = json_object_new_array();

    struct dirent *ent;
    while ((ent = readdir(dir)) != NULL) {
        struct json_object *json_return_name = json_object_new_string(ent->d_name);
        struct json_object *json_return_type = json_object_new_int(ent->d_type);

        struct json_object *json_return_file = json_object_new_object();
        json_object_object_add(json_return_file, "name", json_return_name);
        json_object_object_add(json_return_file, "type", json_return_type);

        json_object_array_add(json_return_array, json_return_file);
    }
    closedir(dir);

    const char *message = json_object_to_json_string(json_return_array);
    mg_send_head(c, 200, strlen(message), "Content-Type: application/json");
    mg_send(c, message, strlen(message));

    json_object_put(json_return_array);
}

void file_manager_register_endpoints(struct mg_connection *c)
{
    mg_register_http_endpoint(c, "/file-manager/list-directory-contents", event_handler_file_manager_list_directory_contents MG_UD_ARG(NULL));
}
