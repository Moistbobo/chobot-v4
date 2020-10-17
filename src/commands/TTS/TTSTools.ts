import { ServerConfig } from '../../types/db/ServerConfig';

const isTTSChannel = async (channelId: string, serverId: string) => {
  const serverConfig = await ServerConfig.findOne({ serverId }) || new ServerConfig({ serverId });
  const { ttsChannelId } = serverConfig;

  return ttsChannelId === channelId;
};

export default {
  isTTSChannel,
};
