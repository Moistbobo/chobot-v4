import { TextChannel } from 'discord.js';
import { CommandArgs } from '../../../models/CommandArgs';
import { ServerConfig } from '../../../models/db/ServerConfig';
import Embed from '../../../helpers/Embed';

const action = async (args: CommandArgs) => {
  const {
    msg: {
      channel,
      channel: {
        id: channelId,
      },
      member: {
        guild: {
          id: serverId,
        },
        voiceChannelID,
        voiceChannel: {
          name: voiceChannelName,
        },
      },
    },
  } = args;

  const serverConfig = await ServerConfig.findOne({ serverId }) || new ServerConfig({ serverId });

  if (serverConfig.ttsChannelId === channelId) {
    serverConfig.ttsChannelId = null;
    await serverConfig.save();
    const embed = Embed.createMessage('TTS channel removed.');
    return channel.send(embed);
  }

  const textChannel = channel as TextChannel;
  serverConfig.ttsChannelId = channelId;
  await serverConfig.save();
  const embed = Embed.createMessage(`TTS channel set to [${textChannel.name}]`);
  return channel.send(embed);
};

export default action;
