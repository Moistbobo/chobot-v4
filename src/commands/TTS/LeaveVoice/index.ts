import { Command } from '../../../models/Command';
import action from './action';

const LeaveVoice: Command = {
  action,
  name: 'Leave voice',
  description: '',
  triggers: ['disconnect'],
  requiresVoiceChannel: true,
  requiredPermissions: ['SEND_TTS_MESSAGES'],
};

export default LeaveVoice;
