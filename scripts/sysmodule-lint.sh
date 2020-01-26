BASEDIR=$(dirname "$0")

uncrustify --no-backup -c $BASEDIR/../sysmodule/style.cfg $BASEDIR/../sysmodule/source/* $BASEDIR/../sysmodule/source/**/* $BASEDIR/../sysmodule/include/* $BASEDIR/../sysmodule/include/**/*
