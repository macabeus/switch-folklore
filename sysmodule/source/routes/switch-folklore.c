#include <stdio.h>
#include <unistd.h>
#include <switch.h>
#include <mongoose/mongoose.h>

struct file_writer_data {
    FILE *fp;
    size_t bytes_written;
};

void event_handler_switch_folklore_upload(struct mg_connection *c, int event, void *p)
{
    struct file_writer_data *data = (struct file_writer_data *) c->user_data;
    struct mg_http_multipart_part *mp = (struct mg_http_multipart_part *) p;

    if (event == MG_EV_HTTP_PART_BEGIN) {
        if (data == NULL) {
            data = calloc(1, sizeof(struct file_writer_data));
            data->fp = fopen("sdmc:/switch-folklore-logs/exefs.nsp", "w");
            data->bytes_written = 0;

            if (data->fp == NULL) {
                c->flags |= MG_F_SEND_AND_CLOSE;
                return;
            }

            c->user_data = (void *) data;
        }

    } else if (event == MG_EV_HTTP_PART_DATA) {
        if (fwrite(mp->data.p, 1, mp->data.len, data->fp) != mp->data.len) {
            c->flags |= MG_F_SEND_AND_CLOSE;
            return;
        }
        data->bytes_written += mp->data.len;

    } else if (event == MG_EV_HTTP_PART_END) {
        c->flags |= MG_F_SEND_AND_CLOSE;
        fclose(data->fp);
        free(data);
        c->user_data = NULL;

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
}

void event_handler_switch_folklore_replace_version(struct mg_connection *c, int event, void *p)
{
    int result;

    result = access("sdmc:/switch-folklore-logs/exefs.nsp", F_OK);
    if (result == -1) {
        // *INDENT-OFF*
        char message[] = (
            "{"
                "\"status\": \"error\","
                "\"message\": \"New version file does not exists\""
            "}"
        );
        // *INDENT-ON*
        mg_send_head(c, 400, strlen(message), "Content-Type: application/json");
        mg_send(c, message, strlen(message));

        return;
    }

    result = remove("sdmc:/atmosphere/contents/0420000000000011/exefs.nsp");
    if (result != 0) {
        // *INDENT-OFF*
        char message[] = (
            "{"
                "\"status\": \"error\","
                "\"message\": \"Fail to delete the old version\""
            "}"
        );
        // *INDENT-ON*
        mg_send_head(c, 400, strlen(message), "Content-Type: application/json");
        mg_send(c, message, strlen(message));

        return;
    }

    result = rename("sdmc:/switch-folklore-logs/exefs.nsp", "sdmc:/atmosphere/contents/0420000000000011/exefs.nsp");
    if (result != 0) {
        // *INDENT-OFF*
        char message[] = (
            "{"
                "\"status\": \"error\","
                "\"message\": \"Fail to move the new version to the correct folder\""
            "}"
        );
        // *INDENT-ON*
        mg_send_head(c, 400, strlen(message), "Content-Type: application/json");
        mg_send(c, message, strlen(message));

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
        // *INDENT-OFF*
        char message[] = (
            "{"
                "\"status\": \"error\","
                "\"message\": \"Fail when tried to restart\""
            "}"
        );
        // *INDENT-ON*
        mg_send_head(c, 400, strlen(message), "Content-Type: application/json");
        mg_send(c, message, strlen(message));
    }
}

void switch_folklore_register_endpoints(struct mg_connection *c)
{
    mg_register_http_endpoint(c, "/switch-folklore/upload", event_handler_switch_folklore_upload MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/switch-folklore/replace-version", event_handler_switch_folklore_replace_version MG_UD_ARG(NULL));
    mg_register_http_endpoint(c, "/switch-folklore/restart", event_handler_switch_folklore_restart MG_UD_ARG(NULL));
}
