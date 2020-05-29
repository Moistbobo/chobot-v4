import action from './action';
import { Command } from '../../../models/Command';

const DeathmatchLeaderboard: Command = {
  action,
  name: 'Deathmatch Leaderboard',
  triggers: ['deathmatchleaderboard', 'dmlb', 'dmwlb'],
  description: 'Show the top 10 Deathmatch wins',
  usage: '.dmlb',
};

export default DeathmatchLeaderboard;
