import { Command } from '../../../models/Command';
import action from './action';

const Deathmath: Command = {
  action,
  name: 'Deathmatch',
  triggers: ['deathmath'],
  description: '',
};

export default Deathmath;
