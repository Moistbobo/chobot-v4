import action from './action';
import { Command } from '../../../models/Command';

const Patchnotes: Command = {
  name: 'Patchnotes',
  triggers: ['pn', 'patchnotes'],
  description: 'Retrieve BDO patchnotes. Past patchnotes caps at 15',
  usage: '.pn [number of past patchnotes (optional)]\n.pn\n.pn 15',
  action,
};

export default Patchnotes;
