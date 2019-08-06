const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);
var ffmpeg = require('ffmpeg');

module.exports.run = async (bot, message, args)=>{
  const voiceChannel = message.member.voiceChannel;
  if(!voiceChannel) return message.channel.send("You are not in a VC at the moment.");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if(!permissions.has('CONNECT')){
    return message.channel.send("I cannot join the channel you are in as I do not have sufficient permissions.");
  }
  if(!permissions.has('SPEAK')){
    return message.channel.send("I cannot speak in the channel you are in as I do not have sufficient permissions.");
  }

  try{
    var connection = await voiceChannel.join();
  }catch(error){
    console.log(error)
    return;
  }
  const searchQuery = args.join(' ')
  if(!searchQuery)return message.channel.send("You did not tell me what to play.")
  const url = searchQuery.replace(/<(.+)>/g,'$1')
  try{
    const video = await youtube.getVideo(url)
  }catch(error){
    try{
      var videos = await youtube.searchVideos(url, 1);
      var video = await youtube.getVideoByID(videos[0].id);
    }catch(error){
      return message.channel.send("That video returned nul. Dont think this should happen? Report the bug using `brbug {explantion}`")
    }
  }
  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    durationhour: video.duration.hours,
    durationminutes: video.duration.minutes,
    durationseconds: video.duration.seconds
  };
  if(song.durationhour.toString().length <=1){
    var durationarray = "0" + song.durationhour.toString() + ":"
  }else{
    var durationarray = song.durationhour.toString() +":"
  }
  if(song.durationminutes.toString().length <= 1){
    var durationarray = durationarray + "0" + song.durationminutes.toString() + ":"
  }else{
    var durationarray = durationarray + song.durationminutes.toString() + ":"
  }
  if(song.durationseconds.toString().length <= 1){
    var durationarray = durationarray + "0" + song.durationseconds.toString()
  }else {
    var durationarray = durationarray + song.durationseconds.toString()
  }
  message.channel.send(`Now playing 🎵🎵**${song.title} ${durationarray}**🎵🎵`)
  const dispatch = connection.playStream(ytdl(song.url))
    .on('end', ()=>{
      console.log("Song ended");
    })
    .on('error',()=>{
      console.log(error)
    })
    dispatch.setVolumeLogarithmic(5/5);
}

module.exports.help = {
  name: "play",
  aliases: ["vc", "music"],
  description: "Have the bot join your voice channel and play whatever song you want. You must be in a VC for this command to work.\nThis command is in beta, and will probably have some bugs, please be patient and I will have a full release of the command soon.",
  usage: "bplay {url/name}",
  accessibleby: "Anyone"
}
