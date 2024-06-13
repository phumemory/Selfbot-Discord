const strings = require("../strings.json");
const utils = require("../utils");

/** 
 * @description Stops the music and makes the bot leave the channel
 * @param {Discord.Client} client the client that runs the commands
 * @param {Discord.Message} message the command's message
 * @param {Array<String>} args useless here  
 */
module.exports.run = async (client, message, args) => {
    // Check if the user ID matches the specified ID
    const allowedUserId = '837294095335817226';
    if (message.author.id !== allowedUserId) {
        return utils.log(`${message.author.username} You do not have permission to use this command.`);
    }

    const serverQueue = queue.get("queue");
    if (!serverQueue) {
        return utils.log(strings.nothingPlaying);
    }

    serverQueue.songs = [];

    utils.log("Stopped playing music");

    serverQueue.connection._state.subscription.player.stop();

    return utils.log(strings.musicStopped);
};

module.exports.names = {
    list: ["stop", "st"]
};
