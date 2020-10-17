import { Command } from '../../../../types/Command';
import action from './action';

const DeleteAccolade: Command = {
  action,
  name: 'Remove Accolade',
  triggers: ['removeaccolade'],
  description: 'Remove a user\'s accolade.',
  usage: '.removeaccolade [accolade id]',
  requiredPermissions: ['MANAGE_GUILD'],
};

export default DeleteAccolade;
