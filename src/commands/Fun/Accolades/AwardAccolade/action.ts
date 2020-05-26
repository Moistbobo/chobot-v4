import { Message } from 'discord.js';
import moment from 'moment';
import { CommandArgs } from '../../../../models/CommandArgs';
import FindMemberInServer from '../../../../helpers/FindMemberInServer';
import Accolade from '../../../../models/db/AccoladeType';
import Embed from '../../../../helpers/Embed';
import AwardedAccolade from '../../../../models/db/AwardedAccolade';
import MentionUser from '../../../../helpers/MentionUser';
import AppConfig from '../../../../AppConfig';

const action = async (args: CommandArgs) => {
  const {
    msg, msg: {
      channel, content, guild, author,
    },
  } = args;

  const mentionedUser = FindMemberInServer(msg);

  const splitContent = content.split(' ');

  if (!guild || !mentionedUser || splitContent.length < 3) return;

  const accoladeToSearch = splitContent.slice(2).join(' ');

  const accoladeToAward = await Accolade.findOne({ serverId: guild.id, name: accoladeToSearch })
    .collation({ locale: 'en', strength: 2 });

  if (!accoladeToAward) {
    return channel.send(Embed.createMessage(`No accolade found for ${accoladeToSearch}`, true));
  }

  if (mentionedUser.id === author.id) {
    return channel.send(Embed.createMessage('You can\'t give yourself an award', true));
  }

  await channel.send(
    Embed.createMessage(
      `${MentionUser(author.id)}, enter a reason for the award. Or type \`cancel\`.`,
    ),
  );

  const filter = (m: Message) => m.author.id === author.id;

  const messageCollector = channel.createMessageCollector(
    filter,
    {
      time: 60000,
    },
  );

  messageCollector.on('collect', (m: Message) => {
    const reason = m.content;

    if (reason.toLowerCase() === 'cancel') {
      channel.send(Embed.createMessage('Accolade award cancelled'));
      return;
    }

    new AwardedAccolade({
      code: accoladeToAward.code,
      userId: mentionedUser.id,
      serverId: guild.id,
      awardedById: author.id,
      reason,
    }).save();

    const embed = Embed.createEmbed({
      title: 'Award Ceremony',
      thumbnail: mentionedUser.user.avatarURL() || mentionedUser.user.defaultAvatarURL,
      // eslint-disable-next-line max-len
      contents: `On the date ${moment().format('LL')}\n\nI hereby bestow the ${accoladeToAward.name} to the brave Chovy Seal, ${MentionUser(mentionedUser.id)} for ${reason}`,
      image: accoladeToAward.image,
      footer: `Type ${AppConfig.commandPrefix}accolades to check your accolades.`,
    });

    channel.send(embed);

    messageCollector.stop('Finished successfully');
  });
};

export default action;
