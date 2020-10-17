import { Command } from '../../../types/Command';
import action from './action';

const SetTTSChannel: Command = {
  action,
  name: 'Set TTS Channel',
  triggers: ['setttschannel', 'settts'],
  description: 'Set the textchannel the bot will accept tts commands from. Running the command in a channel that is already set will disable it.',
  usage: '.settts',
  requiresVoiceChannel: true,
  requiredPermissions: ['MANAGE_CHANNELS'],
};

export default SetTTSChannel;
