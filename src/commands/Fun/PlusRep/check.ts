import { CommandArgs } from '../../../types/CommandArgs';
import Embed from '../../../helpers/Embed';

const check = async (args: CommandArgs) => {
  const {
    msg: {
      content,
      channel,
    },
  } = args;

  const splitMessage = content.split(' ');

  if (splitMessage.length < 2) {
    await channel.send(Embed.createMessage('Need to specify a target', true));
    return { pass: false, reason: 'No target specified' };
  }

  return { pass: true };
};

export default check;
