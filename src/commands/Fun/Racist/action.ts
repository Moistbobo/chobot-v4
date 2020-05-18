import moment from 'moment';
import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import FunResult from '../../../models/db/FunResult';
import Embed from '../../../helpers/Embed';
import Tools from './tools';

const action = async (args: CommandArgs) => {
  const { msg, msg: { channel, author } } = args;

  let targetUser;

  const mentionedUser = FindMemberInServer(msg);
  if (!mentionedUser) {
    targetUser = author;
  } else {
    targetUser = mentionedUser.user;
  }

  if (targetUser.id === '711786846811586600') {
    const embed = Embed.createEmbed({
      contents: 'You are brandon.',
      thumbnail: targetUser.avatarURL,
    });

    await channel.send(embed);
    return;
  }

  const funResult = await FunResult.findOne({ userID: targetUser.id }) || new FunResult();

  const { racist: { lastUpdate } } = funResult;

  if (moment(moment()).diff(lastUpdate, 'days') >= 1) {
    const racistValue = Math.floor(Math.random() * 1000);

    funResult.racist.lastUpdate = moment().toISOString();
    funResult.racist.value = racistValue;
    funResult.userID = targetUser.id;

    const racistLevel = Tools.mapRacistLevel(racistValue);

    const embed = Embed.createEmbed({
      contents: `${targetUser} is **${racistValue}** brandons racist ${Tools.description[racistLevel]}`,
      thumbnail: targetUser.avatarURL,
      image: Tools.images[racistLevel][Math.floor(Math.random() * Tools.images[racistLevel].length)],
    });

    await funResult.save();
    await channel.send(embed);
  } else {
    const racistLevel = Tools.mapRacistLevel(funResult.racist.value);


    const embed = Embed.createEmbed({
      contents: `${targetUser} is **${funResult.racist.value}** brandons racist ${Tools.description[racistLevel]}`,
      thumbnail: targetUser.avatarURL,
      image: Tools.images[racistLevel][Math.floor(Math.random() * Tools.images[racistLevel].length)],
      footer: `Next check: ${moment(funResult.racist.lastUpdate).add(1, 'day').fromNow()}`,
    });

    await channel.send(embed);
  }
};

export default action;
