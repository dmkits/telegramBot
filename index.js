var TOKEN ='500967915:AAGsOgZTHzh5ny69hMe21RALQTJgACqZBVQ';

var TelegramBot = require('node-telegram-bot-api');
var bot= new TelegramBot(TOKEN,{
    polling:true /*метод, с помощью которого бот будет общаться с телеграм api*/
});
var KB={
    currency:'Курс валюты',
    picture:'Картинка'
}
bot.onText(/\/start/, function(msg){
    console.log("msg=",msg);
    var text = "Приветствую, "+msg.from.first_name+"\n Что вы хотите сделать?";
    bot.sendMessage(msg.chat.id, text, {
        reply_markup:{
            keyboard:[
                [KB.currency,KB.picture]
            ]
        }
    });
});

bot.on('message', function(msg){ console.log("msg=",msg);
    switch (msg.text){
        case KB.picture:
            break;
    }
});