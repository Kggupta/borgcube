const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args)=>{
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You do not have permission to do that");
  let usertomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!usertomute) return message.reply("No user specified");
  if (usertomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Cannot mute that person. This message appears if my highest role is lower than the targets highest role or if I do not have the `Manage Roles` permission.");
  let muterole = message.guild.roles.find(`name`, "muted");

  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }

  let timetomute = args[1];
  if (ms(timetomute) === undefined) return message.channel.send("Give a valid time period");
  await(usertomute.addRole(muterole.id));
  let muteEmbed = new Discord.RichEmbed()
  .setTitle("Muted")
  .setColor("RED")
  .addField("Mute Enforcer", `<@${message.author.id}>`)
  .addField(`User with id ${usertomute}`, `Muted for ${ms(timetomute)}`);

  message.channel.send(muteEmbed);

  setTimeout(function(){
    usertomute.removeRole(muterole.id);
    let unmuteEmbed = new Discord.RichEmbed()
    .setTitle(`User with id ${usertomute} has been un-muted`)
    .setColor("RED")
    .addField("Mute was enforced by", `<@${message.author.id}>`);

    return message.channel.send(unmuteEmbed);
  }, ms(timetomute));


}

module.exports.help = {
  name: "mute",
  aliases: ["tempmute","tm"],
  description: "Temporarily mute a player, include a time period in the form of `number` then unit (s,m,h,d)\n -For this command to work the bot must have `Manage Roles` permission and a higher role than the target.\n -If the target has a role that manually gives them permission to send messages this command will not work!",
  usage: "bmute {user} {time}",
  accessibleby: "Administrator"
}
