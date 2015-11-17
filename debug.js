var geddy = require('geddy');

if (geddy.isMaster) {
    geddy.config({
        environment: 'development'
        , workers: 1
    }); 
}   

geddy.start();