import { CommandArgs } from '../../../models/CommandArgs';
import TTSTools from '../TTSTools';
import Embed from '../../../helpers/Embed';

const check = async (args: CommandArgs): Promise<{pass:boolean, reason?:string}> => {
  const {
    voiceConnections,
    msg: {
      channel,
      channel: { id: channelId },
      guild: { id: serverId },
    },
  } = args;

  if (!voiceConnections[serverId]) {
    await channel.send(Embed.createMessage('You need to be in the same voice channel.', true));
    return { pass: false, reason: 'Not in same voice channel' };
  }

  const isTTSChannel = await TTSTools.isTTSChannel(channelId, serverId);
  if (!isTTSChannel) {
    await channel.send(Embed.createMessage('This channel is not tts enabled', true));
    return { pass: false, reason: 'Command executed in non-tts channel' };
  }

  return { pass: true };
};

export default check;
