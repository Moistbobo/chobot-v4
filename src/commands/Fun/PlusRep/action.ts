import moment from 'moment';
import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import FunResult from '../../../models/db/FunResult';
import { RepHistory } from '../../../models/db/RepHistory';
import Embed from '../../../helpers/Embed';

const action = async (args: CommandArgs) => {
  const {
    msg,
    msg: {
      author: {
        id: senderId,
        avatarURL,
        defaultAvatarURL,
      },
      member,
      channel,
    },
  } = args;

  const firstUserMentioned = FindMemberInServer(msg);

  if (!firstUserMentioned || !member || firstUserMentioned.id === senderId) return;

  const {
    displayName: senderName,
  } = member;

  const { displayName: receiverName } = firstUserMentioned;

  const senderFun = await FunResult.findOne({ userID: senderId }) || new FunResult({ userID: senderId });
  const receiverFun = await FunResult.findOne({ userID: firstUserMentioned.id })
      || new FunResult({ userID: firstUserMentioned.id });


  const { reputation: { lastUpdate: senderLastUpdate } } = senderFun;
  const { reputation: { value: receiverRep } } = receiverFun;

  if (moment(moment()).diff(moment(senderLastUpdate), 'ms') > 1) {
    senderFun.reputation.lastUpdate = moment().toISOString();
    receiverFun.reputation.value = receiverRep + 1;

    const repHistory = new RepHistory(
      {
        userId: firstUserMentioned.id,
        senderId,
        isIncrease: true,
        time: moment().toISOString(),
      },
    );

    const embed = Embed.createEmbed(
      {
        contents: `${senderName} has increased ${receiverName}'s reputation`,
        thumbnail: 'https://ih1.redbubble.net/image.566557656.6363/fposter,small,wall_texture,product,750x1000.u5.jpg',
      },
    );

    await channel.send(embed);
    await senderFun.save();
    await receiverFun.save();
    await repHistory.save();
  } else {
    const embed = Embed.createEmbed({
      contents: `${senderName}, you have already used your reputation action for the day.`,
      footer: `Next usage: ${moment(senderLastUpdate).add(1, 'day').fromNow()}`,
    });

    await channel.send(embed);
  }
};

export default action;
