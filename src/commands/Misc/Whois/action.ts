import { GuildMember } from 'discord.js';
import moment from 'moment';
import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import Embed from '../../../helpers/Embed';
import FunResult from '../../../models/db/FunResult';

const action = async (args: CommandArgs) => {
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

  const funResult = await FunResult.findOne({ userID: taggedUser.id }) || new FunResult({ userID: taggedUser });

  const {
    gay: { value: gay },
    iq: { value: iq },
    racist: { value: racist },
    reputation: { value: rep },
  } = funResult;

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
        name: 'Iq',
        value: `${iq || 'N/A'}`,
        inline: true,
      },
      {
        name: 'Gay',
        value: `${gay || 'N/A'}`,
        inline: true,
      },
      {
        name: 'Racist',
        value: `${racist ? `${racist} brandons` : 'N/A'}`,
        inline: true,
      },
      {
        name: 'Reputation',
        value: `${rep}`,
      },
      {
        name: 'Avatar Link',
        value: avatarURL || defaultAvatarURL,
      },
      {
        name: 'Roles',
        value: roles.array().join(', '),
      },
      {
        name: 'Member since',
        value: `${moment(joinedAt).fromNow()}`,
      },
    ],
  });

  return channel.send(embed);
};

export default action;
