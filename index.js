const Promise = require('bluebird');
var TelegramBot = require('node-telegram-bot-api');
var fs=require('fs');
var _=require('lodash');
var schedule = require('node-schedule');
//var clients = require('./clients');      console.log("clients=",clients);
var path= require('path');
var TOKEN ='500967915:AAGsOgZTHzh5ny69hMe21RALQTJgACqZBVQ';

Promise.config({
    cancellation: true
});

var bot= new TelegramBot(TOKEN,{
    polling:true /*метод, с помощью которого бот будет общаться с телеграм api*/
});

bot.onText(/\/start/, function(msg, resp) {                     console.log("msg 18=",msg);console.log("resp 18=",resp);
    bot.sendMessage(msg.chat.id, "Hello", {
        reply_markup: {
            keyboard: [
                [{text: "Register", "request_contact": true}]
            ]
        }
    });
});


bot.on('polling_error', (error) => {
    console.log("polling_error=",error);
});


bot.on('message',(msg)=>{   console.log("!!!!!contact");    console.log("!!!!!msg.chat.text=",msg.chat.text);   console.log("msg 31=",msg);
    if(!msg.chat.text || msg.chat.text!="Register" || !msg.contact || !msg.contact.phone_number) return;
    var phoneNumber=msg.contact.phone_number; console.log("phoneNumber=",phoneNumber);
    var clients= JSON.parse(fs.readFileSync(path.join(__dirname, './clients.json')));           console.log("clients=",clients);
    for(var i=0; i<clients.length; i++){                                                         console.log("clients[i]=",i,clients[i]);
        if(clients[i].phone==phoneNumber){
            var newClient={
                chatId:msg.chat.id,
                phoneNumber:phoneNumber
            };
            try {
                var clientArr = JSON.parse(fs.readFileSync(path.join(__dirname, './registeredClients.json')));
                console.log("clientArr=", clientArr);
            }catch(e){
                console.log("ERROR=",e);
            }
            clientArr.push(newClient);

            try{
            fs.writeFileSync(path.join(__dirname, './registeredClients.json'),JSON.stringify(clientArr));
            }catch(e){
                console.log("writeFileERROR=",e);
            }

            bot.sendMessage(msg.chat.id, "Congratulations!\n You have registered successfully!");

            var j=schedule.scheduleJob('/20 * * * * *', function(){
                console.log("Schedule msg to console");
                var registeredClients=JSON.parse(fs.readFile(path.join(__dirname, './registeredClients.json')),
                    function(err){
                        if(err){
                            console.log("err=",err);
                            return;
                        }
                        if(registeredClients.length>0){
                            for(var i in registeredClients)
                                bot.sendMessage(registeredClients[i]["chatId"], "Schedule msg. Every 20 sec.");
                        }
                    });
            });
        }
    }
});




