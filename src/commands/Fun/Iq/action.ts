import moment from 'moment';
import Discord from 'discord.js';
import { CommandArgs } from '../../../types/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import FunResult from '../../../types/db/FunResult';
import Tools from './tools';
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

  const funResult = await FunResult.findOne({ userID: targetUser.id }) || new FunResult({ userID: targetUser.id });

  const { iq: { lastUpdate } } = funResult;

  if (moment(moment()).diff(lastUpdate, 'days') >= 1) {
    const iqValue = Math.floor(Math.random() * Math.floor(400));

    funResult.iq.value = iqValue;
    funResult.iq.lastUpdate = moment().toISOString();

    const iqImage = await Tools.generateIQImage(iqValue);
    await iqImage.writeAsync(`./iqTest/${targetUser.id}.png`);
    const attachment = new Discord.MessageAttachment(`./iqTest/${targetUser.id}.png`, `iqTest-${targetUser.id}.png`);
    await funResult.save();

    const embed = Embed.createEmbed({
      // eslint-disable-next-line max-len
      contents: `${targetUser.username}'s iq is **${iqValue}**\n${iqValue > 300 ? 'Don\'t worry, you\'re still stupid' : ''}`,
      thumbnail: targetUser.avatarURL() || targetUser.defaultAvatarURL,
      image: `attachment://iqTest-${targetUser.id}.png`,
      file: attachment,
    });

    await channel.send({
      embed,
    });
  } else {
    const { iq: { value: iqValue, lastUpdate: _lastUpdate } } = funResult;

    const attachment = new Discord.MessageAttachment(`./iqTest/${targetUser.id}.png`, `iqTest-${targetUser.id}.png`);

    const embed = Embed.createEmbed({
      // eslint-disable-next-line max-len
      contents: `${targetUser.username}'s iq is **${iqValue}**\n${iqValue > 300 ? 'Don\'t worry, you\'re still stupid' : ''}`,
      footer: `Next check: ${moment(_lastUpdate).add(1, 'day').fromNow()}`,
      thumbnail: targetUser.avatarURL() || targetUser.defaultAvatarURL,
      image: `attachment://iqTest-${targetUser.id}.png`,
      file: attachment,
    });

    await channel.send({
      embed,
    });
  }
};

export default action;
