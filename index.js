const Promise = require('bluebird');
var TelegramBot = require('node-telegram-bot-api');
var fs=require('fs');
var _=require('lodash');
var schedule = require('node-schedule');
var clients = require('./clients');      console.log("clients=",clients);
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


bot.on('message',(msg)=>{                                                                   console.log("msg 31=",msg);   //380637868770
    var phoneNumber=msg.contact.phone_number; console.log("phoneNumber=",phoneNumber);
    //for(var i in clients){
    //    if(clients[i].phone==phoneNumber){
    //        var newClient={
    //            chatId:msg.chat.id,
    //            phoneNumber:phoneNumber
    //        };
    //        fs.writeFile(JSON.stringify(newClient),'a',path.join(__dirname, './registeredClients.json'),function(err){
    //            if(err){
    //                console.log("err=",err);
    //                return;
    //            }
    //            bot.sendMessage(msg.chat.id, "Congratulations!<br> You have registered successfully!");
    //            var j=schedule.scheduleJob('/20 * * * * *', function(){
    //                console.log("Schedule msg to console");
    //                var registeredClients=JSON.parse(fs.readFile(path.join(__dirname, './registeredClients.json')),
    //                    function(err){
    //                        if(err){
    //                            console.log("err=",err);
    //                            return;
    //                        }
    //                        if(registeredClients.length>0){
    //                            for(var i in registeredClients)
    //                                bot.sendMessage(registeredClients[i]["chatId"], "Schedule msg. Every 20 sec.");
    //                        }
    //                    });
    //            });
    //        })
    //    }
    //}
});




