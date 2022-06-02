#include <stdio.h>
#include <switch.h>
#include <mongoose/mongoose.h>
#include <json-c/json.h>
#include <helpers.h>
#include <logs.h>
#include <debug-process.h>

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

enum values_size {
    val_u8,
    val_u16,
    val_u32,
    val_u64
};

void event_handler_process_memory_filter_start(struct mg_connection *c, int event, void *p)
{
    struct http_message *hm = (struct http_message *) p;
    struct json_object *parsed_json;
    struct json_object *json_obj_value;
    struct json_object *json_obj_search_value_size;
    struct json_object *json_obj_pid;
    int64_t value;
    enum values_size search_value_size;
    u64 pid;

    parsed_json = json_tokener_parse(hm->body.p);

    json_object_object_get_ex(parsed_json, "value", &json_obj_value);
    value = json_object_get_int64(json_obj_value);

    json_object_object_get_ex(parsed_json, "searchValueSize", &json_obj_search_value_size);
    search_value_size = json_object_get_int(json_obj_search_value_size);
    if (search_value_size < val_u8 && search_value_size > val_u64) {
        sendError("valueSize is invalid");
        return;
    }

    json_object_object_get_ex(parsed_json, "pid", &json_obj_pid);
    pid = json_object_get_int64(json_obj_pid);

    struct json_object *json_return_array = json_object_new_array();

    MemoryInfo meminfo;
    memset(&meminfo, 0, sizeof(MemoryInfo));

    Result rc;
    u64 lastAddress = 0;
    void *outbuf = malloc(0x40000);

    u8 u8query = value;
    u16 u16query = value;
    u32 u32query = value;
    u64 u64query = value;

    Handle debugHandle;
    rc = svcDebugActiveProcess(&debugHandle, pid);
    if (R_FAILED(rc)) {
        sendError("Fail to attach on the process");
        return;
    }

    do {
        lastAddress = meminfo.addr;
        u32 pageinfo;
        rc = svcQueryDebugProcessMemory(&meminfo, &pageinfo, debugHandle, meminfo.addr + meminfo.size);
        if (R_FAILED(rc)) {
            json_object_array_add(json_return_array, json_object_new_string("fail to query process memory"));
            continue;
        }

        if ((meminfo.perm & Perm_Rw) == Perm_Rw) {
            u64 curaddr = meminfo.addr;
            u64 chunksize = 0x40000;

            while (curaddr < meminfo.addr + meminfo.size) {
                if (curaddr + chunksize > meminfo.addr + meminfo.size) {
                    chunksize = meminfo.addr + meminfo.size - curaddr;
                }

                svcReadDebugProcessMemory(outbuf, debugHandle, curaddr, chunksize);

                if (search_value_size == val_u8) {
                    u8 *u8buf = (u8 *) outbuf;
                    for (u64 i = 0; i < chunksize / sizeof(u8); i++) {
                        if (u8buf[i] == u8query) {
                            json_object_array_add(json_return_array, json_object_new_int64(curaddr + i * sizeof(u8)));
                        }
                    }
                }

                if (search_value_size == val_u16) {
                    u16 *u16buf = (u16 *) outbuf;
                    for (u64 i = 0; i < chunksize / sizeof(u16); i++) {
                        if (u16buf[i] == u16query) {
                            json_object_array_add(json_return_array, json_object_new_int64(curaddr + i * sizeof(u16)));
                        }
                    }
                }

                if (search_value_size == val_u32) {
                    u32 *u32buf = (u32 *) outbuf;
                    for (u64 i = 0; i < chunksize / sizeof(u32); i++) {
                        if (u32buf[i] == u32query) {
                            json_object_array_add(json_return_array, json_object_new_int64(curaddr + i * sizeof(u32)));
                        }
                    }
                }

                if (search_value_size == val_u64) {
                    u64 *u64buf = (u64 *) outbuf;
                    for (u64 i = 0; i < chunksize / sizeof(u64); i++) {
                        if (u64buf[i] == u64query) {
                            json_object_array_add(json_return_array, json_object_new_int64(curaddr + i * sizeof(u64)));
                        }
                    }
                }

                curaddr += chunksize;
            }
        }
    } while (lastAddress < meminfo.addr + meminfo.size);

    free(outbuf);
    svcCloseHandle(debugHandle);

    const char *message = json_object_to_json_string(json_return_array);
    mg_send_head(c, 200, strlen(message), "Content-Type: application/json");
    mg_send(c, message, strlen(message));

    json_object_put(json_return_array);
}

void event_handler_process_memory_filter_over(struct mg_connection *c, int event, void *p)
{
    struct http_message *hm = (struct http_message *) p;
    struct json_object *parsed_json;
    struct json_object *json_obj_new_value;
    struct json_object *json_obj_search_value_size;
    struct json_object *json_obj_addresses;
    struct json_object *json_obj_pid;
    int64_t new_value;
    size_t addresses_array_length;
    enum values_size search_value_size; 
    u64 pid;

    parsed_json = json_tokener_parse(hm->body.p);

    json_object_object_get_ex(parsed_json, "new_value", &json_obj_new_value);
    new_value = json_object_get_int64(json_obj_new_value);

    json_object_object_get_ex(parsed_json, "searchValueSize", &json_obj_search_value_size);
    search_value_size = json_object_get_int(json_obj_search_value_size);
    if (search_value_size < val_u8 && search_value_size > val_u64) {
        sendError("valueSize is invalid");
        return;
    }

    json_object_object_get_ex(parsed_json, "addresses", &json_obj_addresses);
    addresses_array_length = json_object_array_length(json_obj_addresses);

    json_object_object_get_ex(parsed_json, "pid", &json_obj_pid);
    pid = json_object_get_int64(json_obj_pid);

    struct json_object *json_return_array = json_object_new_array();

    Result rc;

    u8 u8query = new_value;
    u16 u16query = new_value;
    u32 u32query = new_value;
    u64 u64query = new_value;

    Handle debugHandle;
    rc = svcDebugActiveProcess(&debugHandle, pid);
    if (R_FAILED(rc)) {
        sendError("Fail to attach on the process");
        return;
    }

    for (int i = 0; i < addresses_array_length; i++) {
        u64 current_address = (u64) json_object_get_int64(json_object_array_get_idx(json_obj_addresses, i));

        if (search_value_size == val_u8) {
            u8 current_value;
            svcReadDebugProcessMemory(&current_value, debugHandle, current_address, sizeof(u8));
            if (current_value == u8query) {
                json_object_array_add(json_return_array, json_object_new_int64(current_address));
            }
        }

        if (search_value_size == val_u16) {
            u16 current_value;
            svcReadDebugProcessMemory(&current_value, debugHandle, current_address, sizeof(u16));
            if (current_value == u16query) {
                json_object_array_add(json_return_array, json_object_new_int64(current_address));
            }
        }

        if (search_value_size == val_u32) {
            u32 current_value;
            svcReadDebugProcessMemory(&current_value, debugHandle, current_address, sizeof(u32));
            if (current_value == u32query) {
                json_object_array_add(json_return_array, json_object_new_int64(current_address));
            }
        }

        if (search_value_size == val_u64) {
            u64 current_value;
            svcReadDebugProcessMemory(&current_value, debugHandle, current_address, sizeof(u64));
            if (current_value == u64query) {
                json_object_array_add(json_return_array, json_object_new_int64(current_address));
            }
        }
    }

    svcCloseHandle(debugHandle);

    const char *message = json_object_to_json_string(json_return_array);
    mg_send_head(c, 200, strlen(message), "Content-Type: application/json");
    mg_send(c, message, strlen(message));

    json_object_put(json_return_array);
}




static Mutex actionLock;

#define FREEZE_LIST_LEN 100
u64 global_val;
u64 global_pid;
u64 global_address;

bool logged = false;
bool logged2 = false;
bool logged3 = false;
bool logged4 = false;

void freezeLoop()
{

    if (logged2 == false) {
        addLogWithoutPayload("thread-start");
        logged2 = true;
    }

    mutexLock(&actionLock);

    if (logged3 == false) {
        addLogWithoutPayload("thread-start-22");
        logged3 = true;
    }

    Handle debugHandle;
    Result rc = svcDebugActiveProcess(&debugHandle, global_pid);
    if (R_FAILED(rc)) {
        return;
    }

    if (logged4 == false) {
        addLog("thread-start-debug", &rc, sizeof(rc));
        logged4 = true;
    }

    u32 val = (u32) global_val;
    rc = svcWriteDebugProcessMemory(debugHandle, &val, global_address, sizeof(u32));

    if (logged == false) {
        addLog("thread-write", &rc, sizeof(rc));
        logged = true;
    }

    svcCloseHandle(debugHandle);

    mutexUnlock(&actionLock);
    svcSleepThread(5e+8L);
}




void event_handler_process_memory_set(struct mg_connection *c, int event, void *p)
{
    struct http_message *hm = (struct http_message *) p;
    struct json_object *parsed_json;
    struct json_object *json_obj_new_value;
    struct json_object *json_obj_value_size;
    struct json_object *json_obj_addresses;
    struct json_object *json_obj_pid;
    int64_t new_value;
    enum values_size value_size; 
    u64 address;
    u64 pid;

    parsed_json = json_tokener_parse(hm->body.p);

    json_object_object_get_ex(parsed_json, "new_value", &json_obj_new_value);
    new_value = json_object_get_int64(json_obj_new_value);

    json_object_object_get_ex(parsed_json, "valueSize", &json_obj_value_size);
    value_size = json_object_get_int(json_obj_value_size);
    if (value_size < val_u8 && value_size > val_u64) {
        sendError("valueSize is invalid");
        return;
    }

    json_object_object_get_ex(parsed_json, "addresses", &json_obj_addresses);
    address = (u64) json_object_get_int64(json_obj_addresses);

    json_object_object_get_ex(parsed_json, "pid", &json_obj_pid);
    pid = json_object_get_int64(json_obj_pid);

    Result rc;

    Handle debugHandle;
    rc = svcDebugActiveProcess(&debugHandle, pid);
    if (R_FAILED(rc)) {
        sendError("Fail to attach on the process");
        return;
    }



    // global_pid = pid;
    // global_val = new_value;
    // global_address = address;


    // Thread freezeThread;
    // rc = threadCreate(&freezeThread, freezeLoop, NULL, NULL, 0x10000, 0x2C, -2);
    // if (R_FAILED(rc)) {
    //     sendError("Fail 1");
    //     addLog("thread-1", &rc, sizeof(rc));
    //     return;
    // }
    // rc = threadStart(&freezeThread);
    // if (R_FAILED(rc)) {
    //     sendError("Fail 22");
    //     addLog("thread-22", &rc, sizeof(rc));
    //     return;
    // }




    if (value_size == val_u8) {
        u8 casted_new_value = (u8) new_value;
        rc = svcWriteDebugProcessMemory(debugHandle, &casted_new_value, address, sizeof(u8));
    }

    if (value_size == val_u16) {
        u16 casted_new_value = (u16) new_value;
        rc = svcWriteDebugProcessMemory(debugHandle, &casted_new_value, address, sizeof(u16));
    }

    if (value_size == val_u32) {
        u32 casted_new_value = (u32) new_value;
        rc = svcWriteDebugProcessMemory(debugHandle, &casted_new_value, address, sizeof(u32));
    }

    if (value_size == val_u64) {
        u64 casted_new_value = (u64) new_value;
        rc = svcWriteDebugProcessMemory(debugHandle, &casted_new_value, address, sizeof(u64));
    }

    svcCloseHandle(debugHandle);

    if (R_FAILED(rc)) {
        sendError("Fail to set the new value");
        return;
    }

    sendError("Success");
}

void process_register_endpoints(struct mg_connection *c)
{
    mg_register_http_endpoint(c, "/process", event_handler_process MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/process/memory/filter/start", event_handler_process_memory_filter_start MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/process/memory/filter/over", event_handler_process_memory_filter_over MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/process/memory/set", event_handler_process_memory_set MG_UD_ARG(NULL));
}
