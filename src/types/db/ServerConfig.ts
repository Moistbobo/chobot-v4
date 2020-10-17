import {
  Document, Schema, model, Types,
} from 'mongoose';

export interface IServerConfig extends Document{
    serverId: string,
    ttsChannelId: string | null,
    commandRules: any,
    cooldowns: any,
}

export const ServerConfigSchema = new Schema({
  serverId: {
    type: String,
    required: true,
  },
  ttsChannelId: {
    type: String,
  },
  commandRules: {
    type: Map,
    of: [String],
    default: {
      test: ['1'],
    },
  },
  cooldowns: {
    type: Map,
    of: [String],
    default: {},
  },
});

export const ServerConfig = model<IServerConfig>('ServerConfig', ServerConfigSchema);
