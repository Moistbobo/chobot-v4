import { Command } from '../../../types/Command';
import action from './action';

const DeathmatchWins: Command = {
  action,
  name: 'Deathmatch Wins',
  triggers: ['deathmatchwins', 'dmw'],
  description: 'Check the number of deathmatch wins of a user.',
  usage: '.dmw [username]\n.dmw',
};

export default DeathmatchWins;
