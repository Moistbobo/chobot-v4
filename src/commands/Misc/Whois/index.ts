import action from './action';
import { Command } from '../../../types/Command';

const Whois: Command = {
  name: 'Whois',
  description: 'Lookup a specific user on the server.',
  usage: '.whois [username]',
  triggers: ['whois'],
  action,
};

export default Whois;
