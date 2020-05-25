import { Command } from '../../../models/Command';
import action from './action';

const Deathmath: Command = {
  action,
  name: 'Deathmatch',
  triggers: ['deathmath'],
  description: 'Start a deathmatch with another user. Does not work on self.',
  usage: '.deathmatch [username]',
};

export default Deathmath;
