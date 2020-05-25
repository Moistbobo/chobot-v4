import { Command } from '../../../../models/Command';
import action from './action';

const CreateAccolade: Command = {
  action,
  name: 'Create Accolade',
  triggers: ['createaccolade'],
  description: '',
  requiredPermissions: ['MANAGE_GUILD'],
};

export default CreateAccolade;
