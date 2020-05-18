import action from './action';
import { Command } from '../../../models/Command';

const Whois: Command = {
  name: 'Whois',
  description: '',
  triggers: ['whois'],
  action,
};

export default Whois;
