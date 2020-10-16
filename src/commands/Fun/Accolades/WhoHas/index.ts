import action from './action';
import { Command } from '../../../../types/Command';

const WhoHas: Command = {
  action,
  name: 'Who has',
  triggers: ['whohas'],
  description: 'Check who in the server has what accolade',
  usage: '.whohas [accolade name]\n.whohas gay ribbon',
};

export default WhoHas;
