import { CommandArgs } from '../../../../types/CommandArgs';
import Accolade from '../../../../types/db/AccoladeType';
import Embed from '../../../../helpers/Embed';
import AwardedAccolade from '../../../../types/db/AwardedAccolade';
import MentionUser from '../../../../helpers/MentionUser';

const action = async (args: CommandArgs) => {
  const { msg: { channel, guild, content } } = args;

  const splitContent = content.split(' ');

  if (!guild || splitContent.length < 2) return;

  const accoladeName = splitContent.slice(1).join(' ');

  const accoladeData = await Accolade.findOne({ serverId: guild.id, name: accoladeName })
    .collation({ locale: 'en', strength: 2 });

  if (!accoladeData) {
    return channel.send(Embed.createMessage(`No accolade found on server for ${accoladeName}`, true));
  }

  const peopleWithAccolade = await AwardedAccolade.find({ serverId: guild.id, code: accoladeData.code });

  if (peopleWithAccolade.length === 0) {
    return channel.send(Embed.createMessage(`No one on server has been awarded a ${accoladeName}`, true));
  }

  const uniqueRecipients = peopleWithAccolade.map((x) => `${MentionUser(x.userId)}`)
    .filter((x, index, self) => self.indexOf(x) === index);

  const embed = Embed.createEmbed({
    title: `${accoladeData.name} recipients`,
    contents: uniqueRecipients.sort().join(', '),
    thumbnail: accoladeData.image,
    footer: `Total recipients: ${uniqueRecipients.length}`,
  });

  return channel.send(embed);
};

export default action;
