import { Command } from '../../../models/Command';
import action from './action';

const Iq: Command = {
  action,
  name: 'Iq',
  triggers: ['iq'],
  description: '',
};

export default Iq;
