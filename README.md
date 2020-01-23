# switch-folklore
> 🧙 Multipurpose WebServer sysmodule for your Nintendo Switch

# How to run lint

## Sysmodule

We are using [Uncrustify](https://github.com/uncrustify/uncrustify) to lint and formart this codebase. You should install it before.
After that you could run it using this command:

```
> sh scripts/sysmodule-lint.sh
```

Warning: Uncrustify is good, but could do mistakes! You should check the differences always when use it. I recommend that you commit your changes before to run it, use `git add -p` and the use `git commit --amend`.

# How to build and run

1 - Clone this repository

```
> git clone git@github.com:macabeus/switch-folklore.git
```

2 - Compile `sysmodule` project

```
> cd switch-folklore/sysmodule
> make
```

3 - Run this script to create the `sd` folder on root of `switch-folklore` folder:

```
> sh scripts/pack.sh
```

4 - Merge the content of `sd` with your sd

5 - On your Nintendo Switch, open hbmenu, go to the app `Kosmos Toolbox`, tap on the button `Background services` and so tap two times on `switch-folklore` to set it on
