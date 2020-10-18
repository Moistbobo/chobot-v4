import { Command } from '../../../types/Command';
import action from './action';

const RollBannerGacha: Command = {
  action,
  name: 'Genshin Banner Gacha',
  triggers: ['genshinbannergacha', 'gbg', 'gbgacha'],
  description: 'Simulate a banner gacha pull on Genshin Impact',
  usage: '.gbgacha [banner name]',
};

export default RollBannerGacha;
