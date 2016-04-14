//chai
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
var client = require('./tcp-client')(2424, 'localhost');

const chalk = require('chalk');
const chalkLog = (message, color) => console.log(chalk[color || 'cyan'](message));

describe('**Digital home server tests**', function () {

    before(()=> {
        chalkLog(`
------------------------------------------
please run the server at localhost:2424.
Digital home intial state should be:
1,lamp,on
2 airconditioner,on,20
------------------------------------------
`);

        return client.connect().then(()=>chalkLog('Connected to server'));
    });

    describe(chalk.magenta('validate login:'), function () {

        describe('listDevices', function () {
            it('should return "please login"', function () {
                return client.send('listDevices').should.eventually.equal('please login');
            })
        });

        describe('switch 1 off', function () {
            it('should return "please login"', function () {
                return client.send('switch 1 off').should.eventually.equal('please login');
            })
        });

        describe('setValue 2 30', function () {
            it('should return "please login"', function () {
                return client.send('setValue 2 30').should.eventually.equal('please login');
            })
        });

        describe('login john', function () {
            it('should return "welcome john"', function () {
                return client.send('login john').should.eventually.equal('welcome john');
            });
        });
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

    after(()=> client.disconnect().then(()=>chalkLog('Disconnected from server')))


});