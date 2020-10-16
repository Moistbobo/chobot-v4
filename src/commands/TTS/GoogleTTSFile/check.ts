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

  return { pass: true };
};

export default check;
