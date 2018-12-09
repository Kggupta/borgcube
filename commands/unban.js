const Discord = require("discord.js");

module.exports.run = async (bot, message, args)=>{
  let unbuser = args[0];
  let server = message.guild.name;
  if (unbuser.length != 18) return message.reply("That is not a valid ID");
  if (!Number.isInteger(parseInt(unbuser))) return message.reply("That is not a valid ID");
  if (!unbuser) return message.reply('You must supply the users **ID**');
  let unbanEmbed = new Discord.RichEmbed()
  .setTitle("Unbanned")
  .setColor("#e56b00")
  .addField("UnBanned User", `${unbuser}`)
  .addField("UnBanned By", `<@${message.author.id}> with ID ${message.author.id}`)
  .addField("UnBanned At", message.createdAt);

  let bannedChannel = message.guild.channels.find(`name`, "mod-log");
  if(!bannedChannel){
    bannedChannel = message.channel
    message.channel.send("Can't find incidents channel. I will unban this person anyway, The Borg suggests that you make a channel called `mod-log` in the future.");
  }
  message.guild.unban(unbuser);
  bannedChannel.send(unbanEmbed);
}

module.exports.help = {
  name: "unban",
  aliases: ["ub"]
}
