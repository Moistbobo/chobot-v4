import { Command } from '../../../models/Command';
import action from './action';

const GoogleTTS: Command = {
  action,
  name: 'GoogleTTS',
  triggers: ['gtts', 'googletts', 'gttsf', 'googlettsf'],
  description: '',
};

export default GoogleTTS;
