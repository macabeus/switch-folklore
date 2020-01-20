BASEDIR=$(dirname "$0")

uncrustify --no-backup -c $BASEDIR/../sysmodule/style.cfg $BASEDIR/../sysmodule/source/*
