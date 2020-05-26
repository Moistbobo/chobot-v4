import action from './action';
import { Command } from '../../../models/Command';

const Value: Command = {
  name: 'Value',
  triggers: ['val', 'value'],
  description: 'Calculate the silver you will get from selling something on the marketplace.',
  usage: '.val [selling price] [fame bonus (1 - 3) (optional)\n.val 1b\n.val 1b 3',
  action,
};

export default Value;
