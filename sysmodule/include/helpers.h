int is_text_file(const char *path);

// *INDENT-OFF*
#define sendError(message) { \
        char payload[] = ( \
            "{" \
                "\"status\": \"error\"," \
                "\"message\": \"" message "\""\
            "}" \
        ); \
        mg_send_head(c, 400, strlen(payload), "Content-Type: application/json"); \
        mg_send(c, payload, strlen(payload)); \
}
// *INDENT-ON*
