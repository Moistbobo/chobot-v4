import { TextChannel } from 'discord.js';
import { CommandArgs } from '../../../types/CommandArgs';
import { ServerConfig } from '../../../types/db/ServerConfig';
import Commands from '../../index';
import { Command } from '../../../types/Command';
import Embed from '../../../helpers/Embed';
import MentionChannel from '../../../helpers/MentionChannel';

const action = async (args: CommandArgs) => {
  const {
    msg: {
      guild,
      content,
      channel,
    },
  } = args;

  const [, commandName] = content.split(' ').map((x) => x.toLowerCase());

  if (!commandName || !guild) return;

  const matchedCommand:Command | undefined = Commands.find((command) => {
    if (command.name.toLowerCase() === commandName
            || command.triggers.includes(commandName)) {
      return command;
    }

    return null;
  });

  if (!matchedCommand) {
    return channel.send(Embed.createMessage(`No command found for \`${commandName}\``, true));
  }

  const serverConfig = await ServerConfig.findOne(
    { serverId: guild.id },
  ) || new ServerConfig({ serverId: guild.id });

  // eslint-disable-next-line no-underscore-dangle
  const _channel = channel as TextChannel;

  const allowedChannels: string[] = serverConfig.commandRules.get(commandName);

  if (allowedChannels && allowedChannels.includes(_channel.id)) {
    const newAllowedChannels = allowedChannels.filter((x) => x !== _channel.id);
    serverConfig.commandRules.set(commandName, newAllowedChannels);

    await serverConfig.save();

    return channel.send(
      Embed.createMessage(`${commandName} will now work on all channels.`),
    );
  }

  let newAllowedChannels = [_channel.id];

  if (allowedChannels) {
    newAllowedChannels = [
      ...newAllowedChannels,
      ...allowedChannels,
    ];
  }

  serverConfig.commandRules.set(commandName, newAllowedChannels);
  await serverConfig.save();

  return channel.send(Embed.createMessage(`${commandName} will now only work for ${MentionChannel(_channel.id)}.`));
};

export default action;
