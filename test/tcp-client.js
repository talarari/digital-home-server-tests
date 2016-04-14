const net = require('net');
const bluebird =require('bluebird');

const strip = (message) => message ? message.replace('\r', '').replace('\n', '').trim() : message;

module.exports  = (port,host)=> {
    const socket = new net.Socket();
    const client = bluebird.promisifyAll(socket);

    const send = (message) => client.writeAsync(message,'UTF8').then(()=>
        new Promise((resolve,reject)=> {
            console.log('wrote:' +message);
            const responseCallback = function(data){
                client.removeListener('data',responseCallback);
                console.log('got:' +data.toString());
                resolve(strip(data.toString()));
            };
            client.on('data', responseCallback);
        })
    );


    return {
        connect: ()=> client.connectAsync(port,host),
        disconnect: ()=> {
            client.destroy();
            return client.onAsync('close');
        },
        send: send
    };
};
