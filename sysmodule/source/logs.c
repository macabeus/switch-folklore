#include <stdio.h>
#include <switch.h>
#include <sys/stat.h>
#include <logs.h>

struct stat st = { 0 };

void startLogs(void)
{
    if (stat("sdmc:/switch-folklore-logs/", &st) == -1) {
        mkdir("sdmc:/switch-folklore-logs/", 0700);
    }
}
