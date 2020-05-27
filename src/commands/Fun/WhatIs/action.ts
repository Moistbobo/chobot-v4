import { CommandArgs } from '../../../models/CommandArgs';
import Tools from './Tools';
import Embed from '../../../helpers/Embed';
import Commands from '../..';


const action = async (args: CommandArgs) => {
  const { msg: { content, guild, channel } } = args;

  const splitContent = content.split(' ');

  if (!guild || splitContent.length < 3) return;

  const searchTerms = splitContent.slice(2).join(' ');

  let [, type] = splitContent;
  type = type.toLowerCase();

  if (type === 'accolade' || type === 'acc') {
    const accolade = await Tools.accoladeLookup(searchTerms, guild.id);

    if (!accolade) {
      return channel.send(Embed.createMessage(`No accolade found for \`${searchTerms}\``));
    }

    const embed = Embed.createEmbed({
      title: accolade.name,
      thumbnail: guild.iconURL() || undefined,
      extraFields:
        [
          {
            name: 'Type',
            value: accolade.type,
          },
          {
            name: 'Description',
            value: accolade.description,
          },
        ],
      image: accolade.image,
      footer: `Accolade on ${guild.name}`,
    });

    return channel.send(embed);
  }

  if (type === 'command') {
    const foundCommand = Commands.find((command) => (command.name.toLowerCase() === searchTerms.toLowerCase())
        || command.triggers.some((trigger) => trigger === searchTerms.toLowerCase()));

    if (!foundCommand) {
      return channel.send(Embed.createMessage(`No command found for \`${searchTerms}\``));
    }

    const embed = Embed.createEmbed({
      title: `${foundCommand.name} Command lookup`,
      extraFields: [
        {
          name: 'Triggers',
          value: foundCommand.triggers.join(', '),
        },
        {
          name: 'Description:',
          value: foundCommand.description || 'No description',
        },
        {
          name: 'Usage',
          value: foundCommand.usage || 'No Usage examples',
        },
        {
          name: 'Required Permissions',
          value: foundCommand.requiredPermissions?.join(', ') || 'Available for all users',
        },
      ],
    });

    return channel.send(embed);
  }
};

export default action;
