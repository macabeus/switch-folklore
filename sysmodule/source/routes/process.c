#include <stdio.h>
#include <switch.h>
#include <mongoose/mongoose.h>
#include <json-c/json.h>
#include <helpers.h>

void event_handler_process(struct mg_connection *c, int event, void *p)
{
    struct json_object *json_return_array = json_object_new_array();

    u64 pids[300];
    u32 countProcess;
    Result rc = svcGetProcessList(&countProcess, pids, 300);
    if (R_FAILED(rc)) {
        sendError("Fail to get the process list");
        return;
    }

    for (int i = 0; i < countProcess; i++) {
        json_object_array_add(json_return_array, json_object_new_int64(pids[i]));
    }

    const char *message = json_object_to_json_string(json_return_array);
    mg_send_head(c, 200, strlen(message), "Content-Type: application/json");
    mg_send(c, message, strlen(message));

    json_object_put(json_return_array);
}

void process_register_endpoints(struct mg_connection *c)
{
    mg_register_http_endpoint(c, "/process", event_handler_process MG_UD_ARG(NULL));
}
