import action from './action';
import check from './check';
import { Command } from '../../../models/Command';

const MinusRep: Command = {
  action,
  check,
  name: '-Rep',
  triggers: ['-rep', 'minusRep', 'mrep', 'nrep' , 'rep-'],
  description: '',
};

export default MinusRep;
