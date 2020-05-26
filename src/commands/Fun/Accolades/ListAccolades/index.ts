import { Command } from '../../../../models/Command';
import action from './action';

const ListAccolades: Command = {
  action,
  name: 'List Accolades',
  triggers: ['listaccolades', 'listacc'],
  description: 'List the available accolades on the server',
  usage: '.listacc',
};

export default ListAccolades;
