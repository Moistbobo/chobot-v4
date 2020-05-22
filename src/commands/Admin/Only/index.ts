import action from './action';
import { Command } from '../../../models/Command';

const Only: Command = {
  action,
  name: 'Only',
  triggers: ['only'],
  description: '',
  requiredPermissions: ['MANAGE_CHANNELS'],
};

export default Only;
