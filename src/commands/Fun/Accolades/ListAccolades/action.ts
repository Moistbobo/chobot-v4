import { CommandArgs } from '../../../../models/CommandArgs';
import Accolade, { IAccolade } from '../../../../models/db/AccoladeType';
import Embed from '../../../../helpers/Embed';

const action = async (args: CommandArgs) => {
  const { msg: { guild, channel } } = args;

  if (!guild) return;

  const serverAccolades = await Accolade.find(({ serverId: guild.id }));

  if (serverAccolades.length === 0) {
    return channel.send(Embed.createMessage('No accolades on server.'));
  }

  const extraFields = serverAccolades.map((a:IAccolade) => (
    {
      name: a.name,
      value: a.description,
      inline: true,
    }
  ));

  const embed = Embed.createEmbed({
    title: `Accolades on ${guild.name}`,
    thumbnail: guild.iconURL() || undefined,
    extraFields,
  });

  return channel.send(embed);
};

export default action;
