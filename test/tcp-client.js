const net = require('net');
const bluebird =require('bluebird');

const strip = (message) => message ? message.replace('\r', '').replace('\n', '').trim() : message;

module.exports  = (port,host)=> {
    const socket = new net.Socket();
    const client = bluebird.promisifyAll(socket);
    var isConnected = false;

    const send = (message) => client.writeAsync(message,'UTF8').then(()=>
        new Promise((resolve,reject)=> {
            const responseCallback = function(data){
                client.removeListener('data',responseCallback);
                resolve(strip(data.toString()));
            };
            client.on('data', responseCallback);
        })
    );

    const connect = ()=> new Promise((resolve,reject)=>{
            client.on('error',err=> reject(err));
            client.connect(port,host,()=>{
                isConnected = true;
                resolve();
            });
        });

    const disconnect = ()=>{
        client.destroy();
        return client.onAsync('close').then(()=> isConnected =false);
    };

    return {
        connect: connect,
        disconnect: disconnect,
        send: send,
        isConnected: isConnected
    };
};
