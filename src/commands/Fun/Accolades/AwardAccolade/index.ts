import { Command } from '../../../../models/Command';
import action from './action';

const AwardAccolade: Command = {
  action,
  name: 'Award Accolade',
  triggers: ['awardaccolade'],
  description: 'Award an accolade to another user. Cannot award to self.',
  usage: '.awardaccolade [username] [accolade]\n.awardaccolade bob medal of chonor',
  requiredPermissions: ['MANAGE_GUILD'],
};

export default AwardAccolade;
