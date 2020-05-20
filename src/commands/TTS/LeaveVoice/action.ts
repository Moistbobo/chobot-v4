import { CommandArgs } from '../../../models/CommandArgs';
import Embed from '../../../helpers/Embed';

const action = (args: CommandArgs) => {
  const {
    voiceConnections,
    msg: {
      member,
      guild,
    },
  } = args;

  if (!member || !guild) return;

  if (member.voice.channelID === voiceConnections[guild.id].channel.id) {
    voiceConnections[guild.id].session.disconnect();
    delete voiceConnections[guild.id];
  }
};

export default action;
