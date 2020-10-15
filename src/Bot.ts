import Discord from 'discord.js';
import Commands from './commands';
import { CommandArgs } from './models/CommandArgs';
import { Command } from './models/Command';
import AppConfig from './AppConfig';
import Db from './services/db/Db';
import Embed from './helpers/Embed';
import { BotVoiceConnection } from './models/BotVoiceConnection';
import { ServerConfig } from './models/db/ServerConfig';
import MentionChannel from './helpers/MentionChannel';

const runBot = (token: string|undefined) => {
  if (!token) {
    console.log('Bot Token is undefined');
    return;
  }

  const voiceConnections: {[index:string]: BotVoiceConnection} = {};

  const onError = (error: Error) => {
    console.log('error has occurred', error.message);
  };

  const onMessage = async (msg: Discord.Message) => {
    const { commandPrefix } = AppConfig;

    if (!commandPrefix) {
      console.error('Please enter a bot prefix in the .env file');
      return;
    }

    if (msg.content[0] !== commandPrefix) return;

    const userCommand = msg.content.split(' ')[0].toLowerCase().replace(commandPrefix, '').trim();

    const commandToRun:Command | undefined = Commands.find((command) => {
      if (command.name.toLowerCase() === userCommand
      || command.triggers.includes(userCommand)) {
        return command;
      }

      return null;
    });

    const commandArgs: CommandArgs = {
      msg,
      voiceConnections,
    };

    if (commandToRun) {
      const {
        channel, author, guild, member,
      } = msg;

      const serverConfig = await ServerConfig.findOne({ serverId: guild?.id })
          || new ServerConfig({ serverId: guild?.id });

      const allowedChannels = serverConfig.commandRules.get(commandToRun.name.toLowerCase());

      if (allowedChannels && allowedChannels.length > 0 && !allowedChannels.includes(channel.id)) {
        const errorMessage = await channel.send(Embed.createMessage(
          `Command ${commandToRun.name} is only enabled on ${allowedChannels
            .map((x: string) => MentionChannel(x)).join(', ')}`,
        ));

        return;
        // return Promise.all([
        //   errorMessage.delete({ timeout: 5000 }),
        //   msg.delete({ timeout: 5000 }),
        // ]);
      }

      if (commandToRun.check) {
        const checkResult:{pass:boolean, reason?:string} = await commandToRun.check(commandArgs);

        if (!checkResult.pass) {
          return console.log(
            // eslint-disable-next-line max-len
            `\nXXXXXX[COMMAND FAILED]\n[${author.username}] has failed executing command [${commandToRun.name}] in [${guild?.name}] id [${guild?.id}]`,
            `\n${checkResult.reason}` ? `Reason: ${checkResult.reason}` : '',
          );
        }
      }

      if (commandToRun.requiresVoiceChannel && !member?.voice) {
        const embed = Embed.createEmbed({
          contents: 'You need to be in a voice channel to use this command.',
        }, true);

        return channel.send(embed);
      }

      if (commandToRun.requiredPermissions && !member?.permissions.has(commandToRun.requiredPermissions)) {
        const missingPermissions = commandToRun.requiredPermissions.filter(
          (x) => !member?.permissions.toArray().includes(x),
        );

        const embed = Embed.createEmbed({
          contents: `You do not have the required permissions to use this command.
          \nMissing:\n\n${missingPermissions.join(', ')}`,
        }, true);

        return channel.send(embed);
      }

      console.log(
        // eslint-disable-next-line max-len
        `\n======[COMMAND EXECUTED]\n[${author.username}] has executed command [${commandToRun.name}] in [${guild?.name}] id [${guild?.id}]\n`,
      );

      commandToRun.action(commandArgs);
    }
  };

  const client = new Discord.Client();

  client.on('message', onMessage);
  client.on('error', onError);

  client.login(token)
    .then(() => {
      console.log('Bot logged in');
      console.log('Commands: \n', Commands.map((command) => command.name));

      return Db.connect();
    })
    .then(() => {
      console.log('Db connected');
    })
    .catch((err: Error) => {
      console.log('Failed initializing bot\n', err.message);
    });
};

export default {
  runBot,
};
