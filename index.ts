import Bot from './src/Bot';
import AppConfig from './src/AppConfig';

setTimeout(() => {
  Bot.runBot(AppConfig.token);
}, 300);
