const strings = require("../strings.json");
const utils = require("../utils");

/**
 * @description Skip the current song
 * @param {Discord.Client} client the client thats runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>}args useless here
 */
module.exports.run = async (client, message, args) => {
  let voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return utils.log(strings.notInVocal);
  }

  // ตรวจสอบสิทธิ์ของผู้ใช้
  const allowedUserId = '837294095335817226';
  if (message.author.id !== allowedUserId) {
    return utils.log(`${message.author.username} You do not have permission to use this command.`);
  }

  const serverQueue = queue.get("queue");
  if (!serverQueue.songs) {
    return utils.log(strings.nothingPlaying);
  }

  utils.log(`Skipped music : ${serverQueue.songs[0].title}`);
  serverQueue.skipped = true;
  serverQueue.connection._state.subscription.player.stop();
  return utils.log(strings.musicSkipped);
};

module.exports.names = {
  list: ["skip", "s"]
};