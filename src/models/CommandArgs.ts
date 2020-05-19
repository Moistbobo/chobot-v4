import * as Discord from 'discord.js';

export interface CommandArgs {
    // Message object
    msg: Discord.Message,
    voiceConnections: {
        [index:string]:{
            session: Discord.VoiceConnection,
            lastActivity: string,
        }
    },
}
