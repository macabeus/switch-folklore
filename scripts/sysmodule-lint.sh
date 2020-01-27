BASEDIR=$(dirname "$0")

uncrustify --no-backup -c $BASEDIR/../sysmodule/style.cfg $BASEDIR/../sysmodule/source/* $BASEDIR/../sysmodule/source/**/* $BASEDIR/../sysmodule/include/* $BASEDIR/../sysmodule/include/**/* $BASEDIR/../restarter/source/* $BASEDIR/../restarter/source/**/* $BASEDIR/../restarter/include/* $BASEDIR/../restarter/include/**/*
