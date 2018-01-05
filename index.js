const Promise = require('bluebird');
var TelegramBot = require('node-telegram-bot-api');
var fs=require('fs');
var _=require('lodash');
var schedule = require('node-schedule');
//var clients = require('./clients');      console.log("clients=",clients);
var path= require('path');
var TOKEN ='500967915:AAGsOgZTHzh5ny69hMe21RALQTJgACqZBVQ';
const https = require('https');

//const options = {
//    hostname: 'https://api.telegram.org',
//    port: 443,
//    path: '/500967915:AAGsOgZTHzh5ny69hMe21RALQTJgACqZBVQ/METHOD_NAME/getUpdates',
//    method: 'GET'
//};

Promise.config({
    cancellation: true
});

var bot= new TelegramBot(TOKEN,{
    polling:true /*метод, с помощью которого бот будет общаться с телеграм api*/
});

var job=schedule.scheduleJob('*/5 * * * * * *', function(){
    console.log("Schedule msg to console");
    try{
        var registeredClients=JSON.parse(fs.readFileSync(path.join(__dirname, './registeredClients.json')));
    }catch (e){
        console.log("ERROR 121=",e);
        return;
    }
    if(registeredClients.length>0){
        for(var j in registeredClients)
            if(registeredClients[j]["msgCount"]<5){                 console.log("registeredClients[j]['msgCount']=",registeredClients[j]["msgCount"]);
                bot.sendMessage(registeredClients[j]["chatId"], "Schedule msg. Every 10 sec.");
                registeredClients[j]["msgCount"]=registeredClients[j]["msgCount"]+1;
                try{
                    fs.writeFileSync(path.join(__dirname, './registeredClients.json'),JSON.stringify(registeredClients));
                }catch(e){
                    console.log("writeFileERROR 133=",e);
                }
            }
    }
});



bot.onText(/\/start/, function(msg, resp) {                     console.log("msg 18=",msg);console.log("resp 18=",resp);
    bot.sendMessage(msg.chat.id, "Hello", {
        reply_markup: {
            keyboard: [
                [{text: "Register", "request_contact": true}]
            ],
            one_time_keyboard:true
        }
    });
});


bot.on('polling_error', (error) => {
    console.log("polling_error=",error);
});

bot.on('message',(msg)=>{                                        console.log("msg 31=",msg);
    if(!msg.contact || !msg.contact.phone_number) return;
    var phoneNumber=msg.contact.phone_number; console.log("phoneNumber=",phoneNumber);

    var clients;
    try {
        clients = JSON.parse(fs.readFileSync(path.join(__dirname, './clients.json'))); console.log("clients=",clients);
    }catch(e){
        console.log("clients parse error 51=",e);
        return;
    }

    for(var i=0; i<clients.length; i++){
        var clientPhoneNum=clients[i].phone;
        if(clientPhoneNum==phoneNumber) {  console.log("clients[i].phone==phoneNumber 78clients[i].phone=",clients[i].phone);
            var newClient = {
                chatId: msg.chat.id,
                phoneNumber: phoneNumber,
                msgCount:0
            };
        //    if(job)job.cancel();
            try{
                var registeredClients=JSON.parse(fs.readFileSync(path.join(__dirname, './registeredClients.json'))); console.log("registeredClients 86=", registeredClients);
            }catch (e){
                console.log("ERROR 65=",e);
                return;
            }
        //  //  job.reschedule('*/5 * * * * * *');
            var registered=false;
            if(registeredClients.length>0){
                for (var j in registeredClients){
                    if(registeredClients[j]["phoneNumber"]==phoneNumber){
                        registeredClients[j]["msgCount"]=0;
                        registered=true;
                    }
                }
            }

            console.log("registered 108=",registered);

            if(!registered){
                registeredClients.push(newClient);
                bot.sendMessage(msg.chat.id, "Congratulations!\n You have registered successfully!");
            }else{
                bot.sendMessage(msg.chat.id, "You are already registered!");
            }
           // if(job)job.cancel();
            try{
                fs.writeFileSync(path.join(__dirname, './registeredClients.json'),JSON.stringify(registeredClients));
            }catch(e){
                console.log("writeFileERROR 86=",e);
            }
        //    job.reschedule('*/5 * * * * * *');
        }
    }
});

//setTimeout(function(){
//    var job=schedule.scheduleJob('*/5 * * * * * *', function(){
//    console.log("Schedule msg to console");
//    try{
//        var registeredClients=JSON.parse(fs.readFileSync(path.join(__dirname, './registeredClients.json')));
//    }catch (e){
//        console.log("ERROR 121=",e);
//        return;
//    }
//    if(registeredClients.length>0){
//        for(var j in registeredClients)
//            if(registeredClients[j]["msgCount"]<5){                 console.log("registeredClients[j]['msgCount']=",registeredClients[j]["msgCount"]);
//                bot.sendMessage(registeredClients[j]["chatId"], "Schedule msg. Every 10 sec.");
//                registeredClients[j]["msgCount"]=registeredClients[j]["msgCount"]+1;
//                try{
//                    fs.writeFileSync(path.join(__dirname, './registeredClients.json'),JSON.stringify(registeredClients));
//                }catch(e){
//                    console.log("writeFileERROR 133=",e);
//                }
//            }
//    }
//     });
//},5000);


