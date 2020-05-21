import { Command } from '../../../models/Command';
import action from './action';

const DeathmatchWins: Command = {
  action,
  name: 'Deathmatch Wins',
  triggers: ['deathmatchwins', 'dmw'],
  description: '',
};

export default DeathmatchWins;
