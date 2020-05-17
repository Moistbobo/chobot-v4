import action from './action';
import { Command } from '../../../models/Command';

const Patchnotes: Command = {
  name: 'Patchnotes',
  triggers: ['pn', 'patchnotes'],
  description: '',
  action,
};

export default Patchnotes;
