import action from './action';
import { Command } from '../../../types/Command';

const Racist: Command = {
  action,
  name: 'Racist',
  description: 'Check how racist a user is.',
  triggers: ['racist'],
  usage: '.racist [username]\n.racist moistbobo\n.racist',
};

export default Racist;
