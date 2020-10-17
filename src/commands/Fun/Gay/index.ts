import action from './action';
import { Command } from '../../../types/Command';

const Gay: Command = {
  action,
  name: 'Gay',
  description: 'Check how gay a user is.',
  triggers: ['gay'],
  usage: '.gay [username]',
};

export default Gay;
