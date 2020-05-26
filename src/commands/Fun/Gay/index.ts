import action from './action';
import { Command } from '../../../models/Command';

const Gay: Command = {
  action,
  name: 'Gay',
  description: 'Check how gay a user is.',
  triggers: ['gay'],
  usage: '.gay [username]',
};

export default Gay;
