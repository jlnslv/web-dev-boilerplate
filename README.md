boilerplate
===========

This is a HTML boilerplate for my private projects.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this boilerplate with this command:

``` shell
npm install
```

Run a dev server (with livereload):
``` shell
grunt server:dev
```

## How-to
The 'index.html` in the root directory is your development file.  The development assets folder is within the `assets` folder.

The idea is that all your assets will be concatenated, minified and optimized into the `public` folder using the following command:
``` shell
grunt build
```



### Add new JavaScript Plugin
New plugins have to added through bower.