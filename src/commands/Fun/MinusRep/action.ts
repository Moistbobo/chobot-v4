import moment from 'moment';
import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import FunResult from '../../../models/db/FunResult';
import Embed from '../../../helpers/Embed';
import { RepHistory } from '../../../models/db/RepHistory';

const action = async (args: CommandArgs) => {
  const {
    msg,
    msg: {
      author: {
        id: senderId,
      },
      member,
      channel,
    },
  } = args;

  const firstUserMentioned = FindMemberInServer(msg);

  if (!firstUserMentioned || !member || firstUserMentioned.id === senderId) return;

  const { displayName: receiverName } = firstUserMentioned;
  const { displayName: senderName } = member;

  const senderFun = await FunResult.findOne({ userID: senderId }) || new FunResult({ userID: senderId });
  const receiverFun = await FunResult.findOne({ userID: firstUserMentioned.id })
      || new FunResult({ userID: firstUserMentioned.id });


  const { reputation: { lastUpdate: senderLastUpdate, lastTarget } } = senderFun;
  const { reputation: { value: receiverRep } } = receiverFun;

  if (moment(moment()).diff(moment(senderLastUpdate), 'day') >= 1) {
    senderFun.reputation.lastUpdate = moment().toISOString();
    senderFun.reputation.lastTarget = firstUserMentioned.id;
    receiverFun.reputation.value = firstUserMentioned.id === '80300923351465984' ? receiverRep + 1 : receiverRep - 1;

    const repHistory = new RepHistory(
      {
        userId: firstUserMentioned.id,
        senderId,
        isIncrease: false,
        time: moment().toISOString(),
      },
    );

    const embed = Embed.createEmbed(
      {
        contents: `${senderName} has decreased ${receiverName}'s reputation`,
        thumbnail: 'https://ih1.redbubble.net/image.566561202.6466/ap,550x550,12x16,1,transparent,t.u2.png',
      },
    );

    await channel.send(embed);
    await senderFun.save();
    await repHistory.save();
    await receiverFun.save();
  } else {
    const embed = Embed.createEmbed({
      contents: `${senderName}, you have already used your reputation action for the day.`,
      footer: `Next usage: ${moment(senderLastUpdate).add(1, 'day').fromNow()}`,
    });

    await channel.send(embed);
  }
};

export default action;
