# glob-searcher

A real CLI to search folders and files using globs patterns.

![Demo of glob-searcher](https://i.imgur.com/vB22wkT.gif)

## Install

```bash
npm i -g glob-searcher # or yarn add -g glob-searcher
```

## Usage

```
gs **/*.ts
gs src/**/*.js
gs *.!(*js)
glob-searcher **/*.*
gs
```

If you don't precise arguments, a prompt will be show to you, and you can select the directory or the file that you prefer. If you select a directory  or a file, it will open it, using your explorer for directories and Visual Studio Code for files (``code`` command must be registered).

## License

Code released under GPL-3.0 license.

Copyright ©, [Olyno](https://github.com/Olyno).