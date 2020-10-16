import {
  Document, Schema, model, Types,
} from 'mongoose';

export interface IServerConfig extends Document{
    serverId: string,
    ttsChannelId: string | null,
    commandRules: any,
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
});

export const ServerConfig = model<IServerConfig>('ServerConfig', ServerConfigSchema);
