# my-app

This project is created for the lowes.Its just a wire for the given requirement not implementation

## What i have used
AngularJs, Bootstrap, yoman, bower, Sass, Grunt

## It will work on

mobile tablet pc

## Build & development
>> First change all the extension .lws to .js 

Run
1. `npm install` 
2. `bower install` 
3. `grunt build`

## Testing

http://localhost:8888/yo/myApp/dist/index.html

## CORS handling
To handle Crossdomain issue api should support JSONP or else it should set CORS on the server where api is deployed.

## App Flow

First angular engine will get loaded, after that controller will intialized call http request to get the data.
On response of the data we are creating product list.

