# Example Implementation of Gulp in a Node Express Project

### Instructions to run the project

- Open the console and navigate into a new working directory
- Run the command: ```git clone https://github.com/Lissy93/gulp-example.git```
- Install the dependencies by running: ```npm install```
- Start the gulp script bu running: ```gulp```





### Features
- Syncs current browser state including page, position on page etc between multiple different browsers both local and remote, using [browser-sync](https://github.com/BrowserSync/browser-sync)
- Auto refreshes the Express server on file change using [nodemon](https://github.com/remy/nodemon)
- Creates a production version of your code from the source directory into the public directory using [Gulp](https://github.com/gulpjs/gulp) and various modules.


### Automated Code Tasks
- Checks all JavaScript (with [gulp-jshint](https://github.com/spalger/gulp-jshint)), CoffeeScript (with [gulp-coffeelint](https://github.com/janraasch/gulp-coffeelint)), CSS (with [gulp-csslint](https://github.com/lazd/gulp-csslint)) and Less for errors and warnings and logs details to the console (with [gulp-util](https://github.com/gulpjs/gulp-util))
- Compiles CoffeeScript into JavaScript using [gulp-coffee](https://github.com/wearefractal/gulp-coffee)
- Compiles Less into CSS using [gulp-less](https://github.com/plus3network/gulp-less)
- Concatinates all JavaScript and CSS into one or a few single files, to reduce the amount of scripts included in the html, using [gulp-concat](https://github.com/wearefractal/gulp-concat)
- Doesn't include unused CSS class in production code using [gulp-uncss](https://github.com/ben-eb/gulp-uncss)
- Minifys all JavaScript using [gulp-uglify](https://github.com/terinjokes/gulp-uglify) and CSS using [gulp-minify-css](https://github.com/murphydanger/gulp-minify-css)
Optionally adds a comment or text item to the bottom of each public file using [gulp-footer](https://github.com/godaddy/gulp-footer)
- Finds the file size of the production file and logs it to the console with [gulp-filesize](https://github.com/Metrime/gulp-filesize)
- It cleans the public directory before putting results in it using [del](https://github.com/sindresorhus/del)
- Pipes all result files into the public directory without creating temporary files with [event-stream](https://github.com/dominictarr/event-stream)
- It only does the above processes on files that have been changed which is determined using [gulp-changed](https://github.com/sindresorhus/gulp-changed)

### Documented Version
[Click here to view a slightly over-commented gist of the gulpfile explaining what everything is doing](https://gist.github.com/Lissy93/1eb7a804b7250d714e02)

