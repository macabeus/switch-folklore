#include <stdio.h>
#include <unistd.h>
#include <switch.h>
#include <mongoose/mongoose.h>
#include <helpers.h>
#include <file-upload.h>

void event_handler_switch_folklore_upload(struct mg_connection *c, int event, void *p)
{
    file_upload("sdmc:/switch-folklore-logs/exefs.nsp", c, event, p);
}

void event_handler_switch_folklore_replace_version(struct mg_connection *c, int event, void *p)
{
    int result;

    result = access("sdmc:/switch-folklore-logs/exefs.nsp", F_OK);
    if (result == -1) {
        sendError("New version file does not exists");
        return;
    }

    result = remove("sdmc:/atmosphere/contents/0420000000000011/exefs.nsp");
    if (result != 0) {
        sendError("Fail to delete the old version");
        return;
    }

    result = rename("sdmc:/switch-folklore-logs/exefs.nsp", "sdmc:/atmosphere/contents/0420000000000011/exefs.nsp");
    if (result != 0) {
        sendError("Fail to move the new version to the correct folder");
        return;
    }

    // *INDENT-OFF*
    char message[] = (
        "{"
            "\"status\": \"success\""
        "}"
    );
    // *INDENT-ON*
    mg_send_head(c, 200, strlen(message), "Content-Type: application/json");
    mg_send(c, message, strlen(message));
}

void event_handler_switch_folklore_restart(struct mg_connection *c, int event, void *p)
{
    u64 pid;
    NcmProgramLocation switchFolkloreLocation = {
        .program_id = 0x0420000000000012,
        .storageID = NcmStorageId_None,
    };

    Result rc = pmshellLaunchProgram(0, &switchFolkloreLocation, &pid);
    if (R_FAILED(rc)) {
        sendError("Fail when tried to restart");
    }
}

void switch_folklore_register_endpoints(struct mg_connection *c)
{
    mg_register_http_endpoint(c, "/switch-folklore/upload", event_handler_switch_folklore_upload MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/switch-folklore/replace-version", event_handler_switch_folklore_replace_version MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/switch-folklore/restart", event_handler_switch_folklore_restart MG_UD_ARG(NULL));
}
