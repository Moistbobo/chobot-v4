import { Command } from '../../../types/Command';
import action from './action';

const GachaStats: Command = {
  action,
  name: 'Genshin Gacha Stats',
  triggers: ['ggs', 'gachastats'],
  description: 'Show stats for gacha sim',
  usage: '.ggs',
};

export default GachaStats;
