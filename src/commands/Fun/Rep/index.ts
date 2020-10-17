import { Command } from '../../../types/Command';

import action from './action';

const Rep: Command = {
  action,
  name: 'Reputation',
  triggers: ['rep'],
  description: 'Check a user\'s reputation. Defaults to sender.',
  usage: '.rep [username]\n.rep moistbobo\n.rep',
};

export default Rep;
