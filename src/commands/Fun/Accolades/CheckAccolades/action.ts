import moment from 'moment';
import { CommandArgs } from '../../../../models/CommandArgs';
import Accolade from '../../../../models/db/AccoladeType';
import AwardedAccolade, { IAwardedAccolade } from '../../../../models/db/AwardedAccolade';
import Embed from '../../../../helpers/Embed';
import FindMemberInServer from '../../../../helpers/FindMemberInServer';
import MentionUser from '../../../../helpers/MentionUser';
import CreatePaginatedMessage from '../../../../helpers/CreatePaginatedMessage';

const action = async (args: CommandArgs) => {
  const {
    msg, msg: {
      channel, guild, member,
    },
  } = args;

  let mentionedUser = FindMemberInServer(msg);

  if (!guild || !member) return;

  if (!mentionedUser) mentionedUser = member;

  const serverAccolades = await Accolade.find({ serverId: guild.id });
  const userAccolades = await AwardedAccolade.find({ serverId: guild.id, userId: mentionedUser.id, isDeleted: false });

  if (userAccolades.length === 0) {
    return channel.send(Embed.createMessage(`${MentionUser(mentionedUser.id)} does not have any awarded accolades.`));
  }

  const mapAccoladeType = (type: string) => {
    if (type === 'medal') return '🎖';
    if (type === 'ribbon') return '🎗';
    if (type === 'collectible') return '🌟';
    return '';
  };

  if (msg.content.includes('-summary')) {
    const resultsPerPage = 6;
    const extraFields = userAccolades.map((userAccolade) => {
      const accoladeBaseData = serverAccolades.find((x) => x.code === userAccolade.code);

      return {
        name: `${mapAccoladeType(accoladeBaseData?.type || '')} ${accoladeBaseData?.name}`,
        value: `Date: ${moment(userAccolade.awardedOn).format('LL')}
        \nid: \`${userAccolade.id}\``,
        inline: true,
      };
    }) as any[];

    const embed = Embed.createEmbed({
      title: `${mentionedUser.displayName}'s awarded accolades`,
      thumbnail: mentionedUser.user.avatarURL() || mentionedUser.user.defaultAvatarURL,
      extraFields: extraFields.slice(0, resultsPerPage),
      footer: `Page 1/${Math.ceil(userAccolades.length / resultsPerPage)}`,
    });

    const message = await channel.send(embed);

    if (userAccolades.length <= resultsPerPage) return;

    const onChange = (index: number) => {
      const newEmbed = Embed.createEmbed({
        title: `${mentionedUser?.displayName}'s awarded accolades`,
        thumbnail: mentionedUser?.user.avatarURL() || mentionedUser?.user.defaultAvatarURL,
        extraFields: extraFields.slice(index * resultsPerPage, (index + 1) * resultsPerPage),

        footer: `Page ${index + 1}/${Math.ceil(userAccolades.length / resultsPerPage)}`,
      });

      message.edit(newEmbed);
    };

    return CreatePaginatedMessage(
      {
        message,
        onChange,
        resultsPerPage,
        maxLength: userAccolades.length,
      },
    );
  }

  const resultsPerPage = 1;

  const generateExtraFields = (userAccolade: IAwardedAccolade) => {
    const accoladeData = serverAccolades.find((x) => (x.code === userAccolade.code));
    return (
      [
        {
          name: 'Name',
          value: accoladeData?.name || '',
        },
        {
          name: 'Awarded for',
          value: userAccolade.reason,
        },
        {
          name: 'Awarded On',
          value: moment(userAccolade.awardedOn).format('LL'),
          inline: true,
        },
        {
          name: 'Awarded by',
          value: `${MentionUser(userAccolade.awardedById)}`,
          inline: true,
        },
        {
          name: 'Type',
          value: `${mapAccoladeType(accoladeData?.type || '')}\n${accoladeData?.type}`,
          inline: true,
        },
        {
          name: 'Id',
          value: userAccolade.id,
        },
      ]
    );
  };

  // eslint-disable-next-line no-underscore-dangle
  const _accoladeData = serverAccolades.find((x) => (x.code === userAccolades[0].code));

  const embed = Embed.createEmbed({
    title: `${mentionedUser.displayName}'s awarded accolades`,
    thumbnail: mentionedUser.user.avatarURL() || mentionedUser.user.defaultAvatarURL,
    extraFields: generateExtraFields(userAccolades[0]),
    image: _accoladeData?.image,
    footer: `Page 1/${Math.ceil(userAccolades.length / resultsPerPage)}`,
  });

  const message = await channel.send(embed);

  if (userAccolades.length <= resultsPerPage) return;

  const onChange = (index: number) => {
    const accoladeData = serverAccolades.find((x) => (x.code === userAccolades[index].code));

    const newEmbed = Embed.createEmbed({
      title: `${mentionedUser?.displayName}'s awarded accolades`,
      thumbnail: mentionedUser?.user.avatarURL() || mentionedUser?.user.defaultAvatarURL,
      extraFields: generateExtraFields(userAccolades[index]),
      image: accoladeData?.image,
      footer: `Page ${index + 1}/${Math.ceil(userAccolades.length / resultsPerPage)}`,
    });

    message.edit(newEmbed);
  };

  return CreatePaginatedMessage(
    {
      message,
      onChange,
      resultsPerPage,
      maxLength: userAccolades.length,
    },
  );
};

export default action;
