import { CommandArgs } from '../../../../models/CommandArgs';
import Accolade, { IAccolade } from '../../../../models/db/AccoladeType';
import Embed from '../../../../helpers/Embed';
import CreatePaginatedMessage from '../../../../helpers/CreatePaginatedMessage';
import MapAccoladeType from '../../../../helpers/MapAccoladeType';

const action = async (args: CommandArgs) => {
  const { msg: { guild, channel } } = args;

  if (!guild) return;

  const serverAccolades = await Accolade.find(({ serverId: guild.id }));

  if (serverAccolades.length === 0) {
    return channel.send(Embed.createMessage('No accolades on server.'));
  }

  const resultsPerPage = 4;

  const extraFields = serverAccolades.map((a:IAccolade) => (
    {
      name: `${MapAccoladeType(a.type)} ${a.name}`,
      value: `${a.description}`,
    }
  )) as [];

  const embed = Embed.createEmbed({
    title: `Accolades on ${guild.name}`,
    thumbnail: guild.iconURL() || undefined,
    extraFields: extraFields.slice(0, resultsPerPage),
    // eslint-disable-next-line max-len
    footer: `Type .whatis accolade [accolade name] for more information (Page 1/${Math.ceil(serverAccolades.length / resultsPerPage)})`,
  });

  const message = await channel.send(embed);

  if (serverAccolades.length <= resultsPerPage) return;

  const onChange = (index: number) => {
    const newEmbed = Embed.createEmbed({
      title: `Accolades on ${guild.name}`,
      thumbnail: guild.iconURL() || undefined,
      extraFields: extraFields.slice(index * resultsPerPage, (index + 1) * resultsPerPage),
      // eslint-disable-next-line max-len
      footer: `Type .whatis accolade [accolade name] for more information (Page ${index + 1}/${Math.ceil(serverAccolades.length / resultsPerPage)})`,
    });

    message.edit(newEmbed);
  };

  await CreatePaginatedMessage({
    message,
    resultsPerPage,
    onChange,
    maxLength: serverAccolades.length,
  });
};

export default action;
