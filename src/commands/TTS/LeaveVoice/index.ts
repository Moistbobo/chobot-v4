import { Command } from '../../../models/Command';
import action from './action';
import check from './check';

const LeaveVoice: Command = {
  action,
  check,
  name: 'Leave voice',
  description: '',
  triggers: ['disconnect'],
  requiresVoiceChannel: true,
  requiredPermissions: ['SEND_TTS_MESSAGES'],
};

export default LeaveVoice;
