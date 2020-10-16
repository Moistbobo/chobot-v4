import { Command } from '../../../types/Command';
import action from './action';

const WhatIs: Command = {
  action,
  name: 'What is',
  triggers: ['whatis', 'what'],
  description: 'Lookup something specific to the bot, such as accolade data or command information.',
  usage: '.whatis [type] [search terms]\n.whatis command deathmatch',
};

export default WhatIs;
