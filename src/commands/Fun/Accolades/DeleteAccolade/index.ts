import { Command } from '../../../../models/Command';
import action from './action';

const DeleteAccolade: Command = {
  action,
  name: 'Remove Accolade',
  triggers: ['removeaccolade'],
  description: 'Remove a user\'s accolade.',
  usage: '.removeaccolade [accolade id]',
};

export default DeleteAccolade;
