import { Command } from '../../../models/Command';

import action from './action';

const Rep: Command = {
  action,
  name: 'Reputation',
  triggers: ['rep'],
  description: '',
};

export default Rep;
