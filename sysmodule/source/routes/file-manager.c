#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <switch.h>
#include <mongoose/mongoose.h>
#include <json-c/json.h>
#include <helpers.h>

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
        sendError("Directory does not exist");
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

        if (ent->d_type == DT_REG) {
            char path_with_filename[512] = { 0 };
            strcpy(path_with_filename, path);
            strcat(path_with_filename, "/");
            strcat(path_with_filename, ent->d_name);

            struct json_object *json_return_type = json_object_new_int(is_text_file(path_with_filename));
            json_object_object_add(json_return_file, "isTextFile", json_return_type);
        }

        json_object_array_add(json_return_array, json_return_file);
    }
    closedir(dir);

    const char *message = json_object_to_json_string(json_return_array);
    mg_send_head(c, 200, strlen(message), "Content-Type: application/json");
    mg_send(c, message, strlen(message));

    json_object_put(json_return_array);
}

void event_handler_file_manager_file_content(struct mg_connection *c, int event, void *p)
{
    struct http_message *hm = (struct http_message *) p;
    struct json_object *parsed_json;
    struct json_object *json_path;
    const char *path;

    parsed_json = json_tokener_parse(hm->body.p);
    json_object_object_get_ex(parsed_json, "path", &json_path);
    path = json_object_get_string(json_path);

    switch (is_text_file(path)) {
    case -1: {
        sendError("Fail when tried to open this file");
        break;
    }

    case 0: {
        sendError("It is not a text file");
        break;
    }

    case 1:
        mg_http_serve_file(c, hm, path, mg_mk_str("text/plain"), mg_mk_str(""));
    }
}

void event_handler_file_manager_download(struct mg_connection *c, int event, void *p)
{
    struct http_message *hm = (struct http_message *) p;
    struct json_object *parsed_json;
    struct json_object *json_path;
    const char *path;

    parsed_json = json_tokener_parse(hm->body.p);
    json_object_object_get_ex(parsed_json, "path", &json_path);
    path = json_object_get_string(json_path);

    mg_http_serve_file(c, hm, path, mg_mk_str("application/x-binary"), mg_mk_str(""));
}

void file_manager_register_endpoints(struct mg_connection *c)
{
    mg_register_http_endpoint(c, "/file-manager/list-directory-contents", event_handler_file_manager_list_directory_contents MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/file-manager/get-file-text-content", event_handler_file_manager_file_content MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/file-manager/download", event_handler_file_manager_download MG_UD_ARG(NULL));
}
