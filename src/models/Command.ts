import Discord from 'discord.js';
import { CommandArgs } from './CommandArgs';

export interface Command {
    name: string;
    triggers: string[];
    action: (args:CommandArgs) => any| void;
    description?: string;

    requiredPermissions?: Discord.PermissionString[],
    requiresVoiceChannel?: boolean,
}
