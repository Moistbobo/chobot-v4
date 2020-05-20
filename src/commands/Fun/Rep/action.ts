import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import FunResult from '../../../models/db/FunResult';
import Embed from '../../../helpers/Embed';

const Rep = async (args: CommandArgs) => {
  const {
    msg,
    msg: {
      channel,
      content,
      member: {
        displayName,
        id: authorId,
      },
      author: {
        avatarURL,
        defaultAvatarURL,
      },
    },
  } = args;

  if (content.split(' ').length > 1) {
    const mentionedUser = FindMemberInServer(msg);

    if (!mentionedUser) return;

    if (mentionedUser.id === authorId) return;

    const funResult = await FunResult.findOne({ userID: mentionedUser.id })
        || new FunResult({ userID: mentionedUser.id });

    const embed = Embed.createEmbed({
      title: 'Reputation',
      contents: `${mentionedUser.displayName} has ${funResult.reputation.value} reputation`,
      thumbnail: mentionedUser.user.avatarURL || mentionedUser.user.defaultAvatarURL,
    });

    await channel.send(embed);
  } else {
    const funResult = await FunResult.findOne({ userID: authorId })
    || new FunResult({ userID: authorId });

    const embed = Embed.createEmbed({
      title: 'Reputation',
      contents: `${displayName} has ${funResult.reputation.value} reputation`,
      thumbnail: avatarURL || defaultAvatarURL,
    });

    await channel.send(embed);
  }
};

export default Rep;
