import { Command } from '../../../../models/Command';
import action from './action';

const CreateAccolade: Command = {
  action,
  name: 'Create Accolade',
  triggers: ['createaccolade'],
  description: 'Create a new accolade. 60 second timeout',
  usage: '.createaccolade\n\nAnd then follow the instructions.',
  requiredPermissions: ['MANAGE_GUILD'],
};

export default CreateAccolade;
