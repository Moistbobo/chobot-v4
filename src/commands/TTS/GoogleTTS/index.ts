import { Command } from '../../../types/Command';
import action from './action';
import check from './check';

const GoogleTTS: Command = {
  action,
  check,
  name: 'GoogleTTS',
  triggers: ['gtts', 'googletts', 'gttsf', 'googlettsf'],
  description: 'Makes the bot join your voice channel and speak using Text to Speech.\n'
      + 'For language list, refer to Google cloud TTS documentation.',
  usage: '.gtts [language(optional)] [text to speak]\n.gtts ja-JP I will commit sudoku',
  requiresVoiceChannel: true,
  requiredPermissions: ['SEND_TTS_MESSAGES'],
};

export default GoogleTTS;
