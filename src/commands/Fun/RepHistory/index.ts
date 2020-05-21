import { Command } from '../../../models/Command';
import action from './action';

const RepHistory: Command = {
  action,
  name: 'Reputation History',
  triggers: ['rephistory', 'rh'],
  description: '',
};

export default RepHistory;
