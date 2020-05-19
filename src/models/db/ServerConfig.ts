import { Document, Schema, model } from 'mongoose';

export interface IServerConfig extends Document{
    serverId: string,
    ttsChannelId: string | null
}

export const ServerConfigSchema = new Schema({
  serverId: {
    type: String,
    required: true,
  },
  ttsChannelId: {
    type: String,
  },
});

export const ServerConfig = model<IServerConfig>('ServerConfig', ServerConfigSchema);
