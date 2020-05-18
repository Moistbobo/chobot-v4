import { Guild, GuildMember } from 'discord.js';
import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import Embed from '../../../helpers/Embed';

const action = (args: CommandArgs) => {
  const { msg, msg: { channel } } = args;
  const taggedUser = FindMemberInServer(msg);

  if (!taggedUser) return;

  const {
    displayName,
    nickname,
    joinedAt,
    roles,
    premiumSince,
    user: {
      avatarURL,
      defaultAvatarURL,
    },
  } = taggedUser as GuildMember;

  const embed = Embed.createEmbed({
    title: `Whois report for ${displayName}`,
    thumbnail: avatarURL || defaultAvatarURL,
    extraFields:
    [
      {
        name: 'Display Name',
        value: displayName,
        inline: true,
      },
      {
        name: 'Nickname',
        value: nickname || 'No nickname set',
        inline: true,
      },
      {
        name: 'Is booster',
        value: `${!!premiumSince}`,
        inline: true,
      },
      {
        name: 'Avatar Link',
        value: avatarURL || defaultAvatarURL,
      },
      {
        name: 'Roles',
        value: roles.array().join(', '),
      },
    ],
    footer: `Joined at ${joinedAt}`,
  });

  return channel.send(embed);
};

export default action;
