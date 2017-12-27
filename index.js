var TelegramBot = require('node-telegram-bot-api');
var fs=require('fs');
var _=require('lodash');
var TOKEN ='500967915:AAGsOgZTHzh5ny69hMe21RALQTJgACqZBVQ';

var bot= new TelegramBot(TOKEN,{
    polling:true /*метод, с помощью которого бот будет общаться с телеграм api*/
});
var KB={
    currency:'Курс валюты',
    picture:'Картинка',
    cat:"Котик",
    car:"Машина",
    back:"Назад"
};
var picSrcs={
    [KB.cat]:['cat1.jpg','cat2.jpg','cat3.jpg'],
    [KB.car]:['car1.jpg','car2.jpg','car3.jpg']
};
bot.onText(/\/start/, function(msg){
    greetClient(msg);
});

bot.on('message', function(msg){ console.log("msg=",msg);
    switch (msg.text){
        case KB.picture:
            sendScreenPicture(msg.chat.id);
            break;
        case KB.currency:
            break;
        case KB.back:
            greetClient(msg,false);
            break;
        case KB.cat:
        case KB.car:
            sedPictureByName(msg.chat.id,msg.text);
            break;
    }
});
function sendScreenPicture(chatID) {
    bot.sendMessage(chatID, 'Выберите тип картинки:', {
        reply_markup: {
            keyboard: [
                [KB.car, KB.cat],
                [KB.back]
            ]
        }
    })
}
function greetClient(msg, greet=true){
    var text = greet
        ?"Приветствую, "+msg.from.first_name+"\n Что вы хотите сделать?"
        :"Что вы хотите сделать?";
    bot.sendMessage(msg.chat.id, text, {
        reply_markup:{
            keyboard:[
                [KB.currency,KB.picture]
            ]
        }
    });
}
function sedPictureByName(chatID,pictureName){
    bot.sendMessage(chatID,"Загружаю...");
    var srcs=picSrcs[pictureName];
    var src=srcs[_.random(0,srcs.length-1)];
    var picture=fs.readFile(__dirname+'/pictures/'+src,function (err, picture) {
        if(err) throw new Error(err);
        bot.sendPhoto(chatID,picture).then(()=>
            bot.sendMessage(chatID,"Картинка отправлена"));
        }
    );
}