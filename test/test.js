//chai
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
var client = require('./tcp-client')(2424, 'localhost');
const log = require('./logger')();
const chalk = require('chalk');

describe('**Digital home server tests**', function () {

    before(()=> {
        log.i(`
------------------------------------------
please run the server at localhost:2424.
Digital home intial state should be:
1,lamp,on
2 airconditioner,on,20
------------------------------------------
`);

        return client.connect()
            .then(()=>log.i('Connected to server'))
            .catch(()=> log.e('Failed to connect to server. \nPlease make sure server is running on localhost:2424\n'));

    });

    describe(chalk.magenta('listDevices:'), function () {
        describe('listDevices', function () {

            it(`should return initial state:
            1,lamp,on
            2,airconditioner,on,20`, function () {
                return client.send('listDevices').should.eventually.include('1,lamp,on').and.include('2,airconditioner,on,20');
            });
        });

    });

    describe(chalk.magenta('switch:'), function () {
        describe('switch 1 off', function () {
            it(`after action listDevices should contain line:
                1,lamp,off`, function () {
                return client.send('switch 1 off')
                    .then(()=> client.send('listDevices'))
                    .should.eventually.include('1,lamp,off');

            });
        });

        describe('switch 2 off', function () {
            it(`after action listDevices should contain line:
                2,airconditioner,off,20`, function () {
                return client.send('switch 2 off')
                    .then(()=> client.send('listDevices'))
                    .should.eventually.include('2,airconditioner,off,20');
            });
        });

    });

    describe(chalk.magenta('setValue:'), function () {
        describe('setValue 2 30', function () {
            it(`after action listDevices should contain line:
                2,airconditioner,off,30`, function () {
                return client.send('setValue 2 30')
                    .then(()=> client.send('listDevices'))
                    .should.eventually.include('2,airconditioner,off,30');
            });
        });
    });

    after(function(){
        if (client.isConnected){
            return client.disconnect()
                .then(()=>log.i('Disconnected from server'))
                .catch(err=> log.e('Failed to disconnect from server'))
        }

    })


});