import action from './action';
import { Command } from '../../../types/Command';

const AllNotes: Command = {
  name: 'AllNotes',
  triggers: ['an', 'allnotes'],
  description: 'Retrieve all BDO Updates.',
  usage: '.an [number of past patchnotes (optional)]\n.an',
  action,
};

export default AllNotes;
