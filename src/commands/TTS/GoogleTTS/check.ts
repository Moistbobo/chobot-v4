import { CommandArgs } from '../../../types/CommandArgs';
import TTSTools from '../TTSTools';
import Embed from '../../../helpers/Embed';

const check = async (args: CommandArgs): Promise<{pass:boolean, reason?:string}> => {
  const {
    msg: {
      channel,
      channel: { id: channelId },
      member,
      guild,
      content,
    },
  } = args;

  if (content.split.length < 2 || !member || !member.voice || !guild) {
    return { pass: false, reason: 'Insufficient parameters for command' };
  }

  const isTTSChannel = await TTSTools.isTTSChannel(channelId, guild.id);
  if (!isTTSChannel) {
    await channel.send(Embed.createMessage('This channel is not tts enabled', true));
    return { pass: false, reason: 'Command executed in non-tts channel' };
  }

  return { pass: true };
};

export default check;
