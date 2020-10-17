import { Command } from '../../../types/Command';
import action from './action';

const Iq: Command = {
  action,
  name: 'Iq',
  triggers: ['iq'],
  description: 'Check a user\'s IQ.',
};

export default Iq;
