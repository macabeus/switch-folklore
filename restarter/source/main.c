#include <stdio.h>
#include <stdlib.h>
#include <switch.h>

u32 __nx_applet_type = AppletType_None;

#define INNER_HEAP_SIZE 0xA7000
size_t nx_inner_heap_size = INNER_HEAP_SIZE;
char nx_inner_heap[INNER_HEAP_SIZE];

#define addLog(name, payload, payloadSize) { \
        FILE *fp; \
        fp = fopen("sdmc:/switch-folklore-logs/" name, "w"); \
        fwrite(payload, payloadSize, 1, fp); \
        fclose(fp); \
}

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

    rc = pmshellInitialize();
    if (R_FAILED(rc))
        fatalThrow(rc);
}

void __attribute__((weak)) userAppExit(void);

void __attribute__((weak)) __appExit(void)
{
    fsdevUnmountAll();
    fsExit();
    smExit();
    pmshellExit();
}

int main(int argc, char *argv[])
{
    Result rc;

    rc = pmshellTerminateProgram(0x0420000000000011);
    if (R_FAILED(rc)) {
        addLog("restarter-fail-terminate", &rc, sizeof(rc));
        return 0;
    }

    u64 pid;
    NcmProgramLocation switchFolkloreLocation = {
        .program_id = 0x0420000000000011,
        .storageID = NcmStorageId_None,
    };

    rc = pmshellLaunchProgram(0, &switchFolkloreLocation, &pid);
    if (R_FAILED(rc)) {
        addLog("restarter-fail-start", &rc, sizeof(rc));
        return 0;
    }

    return 0;
}
