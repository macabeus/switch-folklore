void startLogs(void);

#define addLog(name, payload, payloadSize) { \
        FILE *fp; \
        fp = fopen("sdmc:/switch-folklore-logs/" name, "w"); \
        fwrite(payload, payloadSize, 1, fp); \
        fclose(fp); \
}

#define addLogWithoutPayload(name) { \
        FILE *fp; \
        fp = fopen("sdmc:/switch-folklore-logs/" name, "w"); \
        fclose(fp); \
}
