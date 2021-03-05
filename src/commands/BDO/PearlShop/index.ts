import action from './action';
import { Command } from '../../../types/Command';

const PearlShop: Command = {
  name: 'PearlShop',
  triggers: ['ps', 'pearlshop'],
  description: 'Retrieve BDO Pearl shop updates.',
  usage: '.pa [number of past patchnotes (optional)]\n.pa',
  action,
};

export default PearlShop;
