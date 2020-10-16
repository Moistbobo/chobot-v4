import * as Discord from 'discord.js';
import { BotVoiceConnection } from './BotVoiceConnection';

export interface CommandArgs {
    msg: Discord.Message,
    voiceConnections: {
        [index:string]: BotVoiceConnection
    },
}
