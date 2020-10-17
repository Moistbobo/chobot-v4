import action from './action';
import { Command } from '../../../types/Command';

const HelloWorld: Command = {
  name: 'Hello world',
  triggers: ['helloWorld', 'hw'],
  action,
};

export default HelloWorld;
