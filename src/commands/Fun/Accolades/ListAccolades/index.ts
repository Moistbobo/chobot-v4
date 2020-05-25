import { Command } from '../../../../models/Command';
import action from './action';

const ListAccolades: Command = {
  action,
  name: 'List Accolades',
  triggers: ['listaccolades', 'listacc'],
  description: '',
};

export default ListAccolades;
