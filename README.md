# switch-folklore
> 🧙 Multipurpose WebServer sysmodule for your Nintendo Switch

# How to run lint

## Sysmodule and Restarter

We are using [Uncrustify](https://github.com/uncrustify/uncrustify) to lint and formart the codebase in C. You should install it before.
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

3 - Compile `restarter` project

```
> cd switch-folklore/restarter
> make
```

4 - Run this script to create the `sd` folder on root of `switch-folklore` folder:

```
> sh scripts/pack.sh
```

5 - Merge the content of `sd` with your sd

6 - On your Nintendo Switch, open hbmenu, go to the app `Kosmos Toolbox`, tap on the button `Background services` and so tap two times on `switch-folklore` to set it on

7 - Run `web` project:

```
> cd switch-folklore/web
> yarn
> yarn run start
```

8 - On your Nintendo Switch, go to hbmenu and click on `Y` to get your IP address. On your computer, go to this IP with the port `8000` (exemple: `192.168.1.94:8000`)
