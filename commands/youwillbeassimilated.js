const Discord = require("discord.js");

module.exports.run = async (bot, message, args)=>{
  let contenttoreply = message.mentions.users.first() || args[0]
  if (contenttoreply.id === "444998388795179042" || contenttoreply.id === "518206536535769099") return message.reply("Feeble human! You would attempt to assimilate The Borg Collective?")
  message.channel.send(`${contenttoreply} http://www.youtube.com/watch?v=AyenRCJ_4Ww`)
}

module.exports.help = {
  name: "assimilate",
  aliases: ["ae", "invade", "borg"]
}
