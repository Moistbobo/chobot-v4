import { CommandArgs } from '../../../models/CommandArgs';
import Embed from '../../../helpers/Embed';

const action = (args: CommandArgs) => {
  const {
    voiceConnections,
    msg: {
      member: { voiceChannel: { id: voiceChannelId } },
      guild: { id: serverId },
      channel,
    },
  } = args;

  if (voiceChannelId === voiceConnections[serverId].channel.id) {
    voiceConnections[serverId].session.disconnect();
    delete voiceConnections[serverId];
  }
};

export default action;
