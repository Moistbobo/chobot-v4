import { Command } from '../../../types/Command';
import action from './action';

const ListBanners: Command = {
  action,
  name: 'List Genshin Banners',
  triggers: ['lgb', 'listgenshinbanners'],
  description: 'List all available banners. Use .bannerinfo [bannername] for more details',
  usage: '.lgb',
};

export default ListBanners;
