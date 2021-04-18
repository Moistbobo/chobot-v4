import action from './action';
import { Command } from '../../../types/Command';

const Caphras: Command = {
  name: 'Caphras',
  triggers: ['c', 'caphras'],
  description: 'Calculate caphras needed to reach a certain level',
  usage: '.an [number of past patchnotes (optional)]\n.an',
  action,
};

export default Caphras;
