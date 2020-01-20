#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <switch.h>
#include <mongoose/mongoose.h>
#include <logs.h>

u32 __nx_applet_type = AppletType_None;

#define INNER_HEAP_SIZE 0xA7000
size_t nx_inner_heap_size = INNER_HEAP_SIZE;
char nx_inner_heap[INNER_HEAP_SIZE];

void __libnx_initheap(void)
{
    void *addr = nx_inner_heap;
    size_t size = nx_inner_heap_size;

    extern char *fake_heap_start;
    extern char *fake_heap_end;

    fake_heap_start = (char *) addr;
    fake_heap_end = (char *) addr + size;
}

void __attribute__((weak)) __appInit(void)
{
    Result rc;

    rc = smInitialize();
    if (R_FAILED(rc))
        fatalThrow(rc);

    rc = fsInitialize();
    if (R_FAILED(rc))
        fatalThrow(rc);

    rc = fsdevMountSdmc();
    if (R_FAILED(rc))
        fatalThrow(rc);

    rc = timeInitialize();
    if (R_FAILED(rc))
        fatalThrow(rc);

    rc = nifmInitialize(NifmInternetConnectionType_WiFi);
    if (R_FAILED(rc))
        fatalThrow(rc);
}

void __attribute__((weak)) userAppExit(void);

void __attribute__((weak)) __appExit(void)
{
    fsdevUnmountAll();
    fsExit();
    smExit();
    timeExit();
}

#define NXLINK_CLIENT_PORT 28771

static time_t start_time = 0;

void socketInit(void)
{
    start_time = time(NULL);

    static const SocketInitConfig socketInitConfig = {
        .bsdsockets_version = 1,

        .tcp_tx_buf_size = 0x800,
        .tcp_rx_buf_size = 0x800,
        .tcp_tx_buf_max_size = 0x25000,
        .tcp_rx_buf_max_size = 0x25000,

        .udp_tx_buf_size = 0,
        .udp_rx_buf_size = 0,

        .sb_efficiency = 1,
    };

    Result rc = socketInitialize(&socketInitConfig);
    if (R_FAILED(rc)) {
        addLog("error-socket-initialize", &rc, sizeof(Result));
    }
}

Result haveInternet()
{
    NifmInternetConnectionType unused0;
    u32 unused1;
    NifmInternetConnectionStatus unused2;
    return R_SUCCEEDED(nifmGetInternetConnectionStatus(&unused0, &unused1, &unused2));
}

struct mg_connection *listen_conn = NULL;

static void event_handler(struct mg_connection *c, int event, void *p)
{
    if (event == MG_EV_HTTP_REQUEST) {
        char message[] = "<!DOCTYPE html><html><head><title>switch-folklore</title></head><body><p>Hello World from Switch</p></body></html>";
        mg_send_head(c, 200, strlen(message), "Content-Type: text/html");
        mg_send(c, message, strlen(message));

    } else if (event == MG_EV_CLOSE) {
        if (c == listen_conn)
            listen_conn = NULL;
    }
}

int main(int argc, char *argv[])
{
    startLogs();
    socketInit();

    struct mg_mgr mgr;
    struct mg_connection *c;

    mg_mgr_init(&mgr, NULL);
    c = mg_bind(&mgr, "8000", event_handler);
    if (c == NULL) {
        addLogWithoutPayload("error-start-server");
        exit(EXIT_FAILURE);
    }

    mg_set_protocol_http_websocket(c);

    while (haveInternet()) {
        mg_mgr_poll(&mgr, 1000);
    }

    mg_mgr_free(&mgr);

    return EXIT_SUCCESS;
}
