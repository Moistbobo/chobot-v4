import { Command } from '../../../types/Command';
import action from './action';

const GenshinGachaBannerInfo: Command = {
  action,
  name: 'Genshin Gacha Banner Info',
  triggers: ['ggbi', 'genshingachabannerinfo'],
  description: 'List details for a given banner',
  usage: '.ggbi Sparkling Steps',
};

export default GenshinGachaBannerInfo;
