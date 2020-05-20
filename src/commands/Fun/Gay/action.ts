import moment from 'moment';
import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import FunResult from '../../../models/db/FunResult';
import Embed from '../../../helpers/Embed';

const action = async (args: CommandArgs) => {
  const { msg, msg: { channel, author } } = args;

  let targetUser;

  const mentionedUser = FindMemberInServer(msg);
  if (!mentionedUser) {
    targetUser = author;
  } else {
    targetUser = mentionedUser.user;
  }

  const funResult = await FunResult.findOne({ userID: targetUser.id }) || new FunResult();

  const { gay: { lastUpdate } } = funResult;

  if (moment(moment()).diff(lastUpdate, 'days') >= 1) {
    const gayValue = Math.floor(Math.random() * 1000);

    funResult.gay.lastUpdate = moment().toISOString();
    funResult.gay.value = gayValue;
    funResult.userID = targetUser.id;

    const embed = Embed.createEmbed({
      contents: `${targetUser.username} is **${gayValue}%** gay.`,
      thumbnail: targetUser.avatarURL() || targetUser.defaultAvatarURL,
    });

    await funResult.save();
    await channel.send(embed);
  } else {
    const embed = Embed.createEmbed({
      contents: `${targetUser.username} is **${funResult.gay.value}%** gay.`,
      thumbnail: targetUser.avatarURL() || targetUser.defaultAvatarURL,
      footer: `Next check: ${moment(funResult.gay.lastUpdate).add(1, 'day').fromNow()}`,
    });

    await channel.send(embed);
  }
};

export default action;
