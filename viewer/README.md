# RBTV Youtube Statistiken

## Development
The following sofware components are needed to setup the development environment:

 - [node](http://nodejs.org/)
 - [npm](https://www.npmjs.com/)
 - [grunt](http://gruntjs.com/)
 - [bower](http://bower.io/)
 - [Yeoman](http://yeoman.io/)

### Install on Linux

    sudo apt-get install nodejs
    sudo apt-get install npm
    sudo npm install -g grunt-cli
    sudo npm install -g bower
    sudo npm install -g yo

It may be necessary to install the legacy package of node with the following command:

    sudo apt-get install nodejs-legacy

### Usage
The project uses [grunt](http://gruntjs.com/) for performing repetitive tasks like minification, compilation and unit testing. The following grunt tasks are available:

 - grunt **serve** (Default): This is the main task which should be used during development. The task will start a webserver and watch any changes on the files. Use [Livereaload](http://livereload.com/) to automatically reload the website on changes.
 - grunt **build**: Build the project. This will create the project in the *dist* directory, ready for deployment on the server.
 - grunt **test**: Run the unit tests.
 - grunt **deploy**: Build project and deploy on server. The *dist* directory will be pushed to the github page repository.

For further automation the [Yeoman](http://yeoman.io/) project is used. The project structure uses the [angular](https://github.com/yeoman/generator-angular) generator which has additional generators for adding new angular views, directives, filters and much more. Read the github page of the angular generator for further details.
