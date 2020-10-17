import Discord from 'discord.js';

export interface BotVoiceConnection {
    session: Discord.VoiceConnection,
    channel: Discord.VoiceChannel,
    lastActivity: string,
}
