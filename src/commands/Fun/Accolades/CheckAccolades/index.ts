import action from './action';
import { Command } from '../../../../types/Command';

const CheckAccolades: Command = {
  action,
  name: 'Check Accolades',
  triggers: ['accolades'],
  // eslint-disable-next-line max-len
  description: 'Check a user\'s awarded accolades. Can also provide a -summary tag to display accolades in brief format.',
  usage: '.accolades [username, Optional]\n.accolades\n.accolades ricurdu\n.accolades ricurdu -summary',
};

export default CheckAccolades;
