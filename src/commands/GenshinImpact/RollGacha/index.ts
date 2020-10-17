import { Command } from '../../../types/Command';
import action from './action';

const RollGacha: Command = {
  action,
  name: 'Genshin Gacha',
  triggers: ['ggacha', 'gg'],
  description: 'Simulate a standard gacha pull on Genshin Impact',
  usage: '.ggacha',
};

export default RollGacha;
