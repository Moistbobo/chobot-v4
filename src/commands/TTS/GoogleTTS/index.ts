import { Command } from '../../../models/Command';
import action from './action';
import check from './check';

const GoogleTTS: Command = {
  action,
  check,
  name: 'GoogleTTS',
  triggers: ['gtts', 'googletts', 'gttsf', 'googlettsf'],
  description: '',
  requiresVoiceChannel: true,
  requiredPermissions: ['SEND_TTS_MESSAGES'],
};

export default GoogleTTS;
