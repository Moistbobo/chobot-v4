import action from './action';
import { Command } from '../../../models/Command';

const Value: Command = {
  name: 'Value',
  triggers: ['val', 'v', 'value'],
  description: '',
  action,
};

export default Value;
