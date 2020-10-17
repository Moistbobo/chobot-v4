import action from './action';
import { Command } from '../../../types/Command';

const Only: Command = {
  action,
  name: 'Only',
  triggers: ['only'],
  description: 'Only allow the specified command to be run in the channel this command is run. Running this command on the same channel will remove the only flag.'
      + ' \'Only\' can be set for multiple channels',
  usage: '.only [command name]\n.only [only]',
  requiredPermissions: ['MANAGE_CHANNELS'],
};

export default Only;
