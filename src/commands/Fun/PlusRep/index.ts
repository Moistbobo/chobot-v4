import action from './action';
import check from './check';
import { Command } from '../../../models/Command';

const PlusRep: Command = {
  action,
  check,
  name: '+Rep',
  triggers: ['+rep', 'plusrep', 'prep', 'rep+'],
  description: 'Give reputation to another user. Does not work for self.',
  usage: '.+rep [username]',
};

export default PlusRep;
