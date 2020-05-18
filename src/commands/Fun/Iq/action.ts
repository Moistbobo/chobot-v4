import moment from 'moment';
import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import FunResult from '../../../models/db/FunResult';
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

  const funResult = await FunResult.findOne({ userID: targetUser.id }) || new FunResult();

  const { iq: { lastUpdate } } = funResult;

  if (moment(moment()).diff(lastUpdate, 'days') >= 1) {
    const iqValue = Math.floor(Math.random() * Math.floor(400));

    funResult.iq.value = iqValue;
    funResult.iq.lastUpdate = moment().toISOString();

    const iqImage = await Tools.generateIQImage(iqValue);
    await Promise.all([
      iqImage.writeAsync(`./iqTest/${targetUser.id}.png`),
      funResult.save(),
    ]);

    const embed = Embed.createEmbed({
      contents: `${targetUser}'s iq is ${iqValue}\n${iqValue > 300 ? 'Don\'t worry, you\'re still stupid' : ''}`,
      thumbnail: targetUser.avatarURL,
    });

    await channel.send({
      embed,
      files: [{
        attachment: `./iqTest/${targetUser.id}.png`,
        name: 'iqTest.png',
      }],
    });
  } else {
    const { iq: { value: iqValue, lastUpdate: _lastUpdate } } = funResult;

    const embed = Embed.createEmbed({
      contents: `${targetUser}'s iq is ${iqValue}\n${iqValue > 300 ? 'Don\'t worry, you\'re still stupid' : ''}`,
      footer: `Next check: ${moment(_lastUpdate).add(1, 'day').fromNow()}`,
      thumbnail: targetUser.avatarURL,
    });

    await channel.send({
      embed,
      files: [{
        attachment: `./iqTest/${targetUser.id}.png`,
        name: 'iqTest.png',
      }],
    });
  }
};

export default action;
