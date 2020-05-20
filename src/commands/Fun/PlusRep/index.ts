import action from './action';
import check from './check';
import { Command } from '../../../models/Command';

const PlusRep: Command = {
  action,
  check,
  name: '+Rep',
  triggers: ['+rep', 'plusrep', 'prep'],
  description: '',
};

export default PlusRep;
