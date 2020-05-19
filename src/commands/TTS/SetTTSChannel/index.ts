import { Command } from '../../../models/Command';
import action from './action';

const SetTTSChannel: Command = {
  action,
  name: 'Set TTS Channel',
  triggers: ['setttschannel', 'settts'],
  description: '',
  requiresVoiceChannel: true,
  requiredPermissions: ['MANAGE_CHANNELS'],
};

export default SetTTSChannel;
