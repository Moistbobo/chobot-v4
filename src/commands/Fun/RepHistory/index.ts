import { Command } from '../../../types/Command';
import action from './action';

const RepHistory: Command = {
  action,
  name: 'Reputation History',
  triggers: ['rephistory', 'rh'],
  description: 'Shows the reputation history for the specified user. Defaults to sender.',
  usage: '.rh [username]\n.rh moistbobo\n.rh',
};

export default RepHistory;
