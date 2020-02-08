#include <stdio.h>
#include <switch.h>
#include <string.h>
#include <logs.h>

/// Return -1 on error, 0 if it isn't a text file or 1 if it's a text file
int is_text_file(const char *path)
{
    FILE *fp;
    fp = fopen(path, "r");

    if (fp == NULL) {
        return -1;
    }

    bool is_text_file = true;
    int current_value;

    for (int i = 0; i <= 100; i++) {
        current_value = fgetc(fp);

        if (feof(fp)) {
            break;
        }

        if (current_value == '\0') {
            is_text_file = false;
            break;
        }
    }

    fclose(fp);

    if (is_text_file) {
        return 1;
    }

    return 0;
}
