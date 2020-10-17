import { Command } from '../../../types/Command';
import action from './action';
import check from './check';

const GoogleTTSFile: Command = {
  action,
  check,
  name: 'GoogleTTSFile',
  triggers: ['tts', 'ttsf'],
  description: '',
  requiredPermissions: ['SEND_TTS_MESSAGES'],
};

export default GoogleTTSFile;
