const strings = require("../strings.json");
const utils = require("../utils");

module.exports.run = async (client, message, args) => {
    // Check if the user ID matches the specified ID
    const allowedUserId = '837294095335817226';
    if (message.author.id !== allowedUserId) {
        return utils.log(`${message.author.username} You do not have permission to use this command.`);
    }

    const serverQueue = queue.get("queue");

    if (!serverQueue) return utils.log(strings.nothingPlayingVolume);

    if (args.length > 1) return utils.log(strings.toMuchArgsVolume);
    if (args.length === 0) return utils.log(strings.noVolume);

    const floatVolume = parseFloat(args[0]);

    if (!Number.isInteger(parseInt(args[0])) && utils.isFloat(floatVolume) && args[0] !== "earrape") {
        return message.channel.send(strings.noNumber);
    }

    if (args[0] === "earrape") {
        utils.log(strings.earrapeWarning).then(async function (warning) {
            await warning.react('✅');

            const filter = (reaction, user) => {
                return reaction.emoji.name === "✅" && user.id === message.author.id;
            };

            const collector = warning.createReactionCollector({ filter, max: 1, time: 8000 });

            collector.on('collect', () => {
                const oldVolume = serverQueue.volume;
                serverQueue.volume = 100;
                serverQueue.connection._state.subscription.player._state.resource.volume.setVolumeLogarithmic(100 / 5);
                utils.log(strings.startEarrape);
                setTimeout(function () {
                    utils.log(strings.endEarrape.replace("VOLUME", oldVolume));
                    serverQueue.volume = oldVolume;
                    return serverQueue.connection._state.subscription.player._state.resource.volume.setVolumeLogarithmic(oldVolume / 5);
                }, 7000);
            });

            collector.on('end', collected => {
                if (collected.size === 0) return utils.log(strings.earrapeFail);
            });

        });
    } else {
        if (args[0] > 10) return utils.log(strings.volumeToHigh);
        if (!message.member.voice.channel) return utils.log(strings.notInVocal);
        utils.log(strings.volumeChanged.replace("VOLUME", args[0]));

        serverQueue.volume = floatVolume;
        serverQueue.connection._state.subscription.player._state.resource.volume.setVolumeLogarithmic(100 / 5);
        return serverQueue.connection._state.subscription.player._state.resource.volume.setVolumeLogarithmic(floatVolume / 5);
    }
};

module.exports.names = {
    list: ["volume", "v"]
};
