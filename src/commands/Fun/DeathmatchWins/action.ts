import { CommandArgs } from '../../../types/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import FunResult from '../../../types/db/FunResult';
import Embed from '../../../helpers/Embed';
import MentionUser from '../../../helpers/MentionUser';

const DeathmatchWins = async (args: CommandArgs) => {
  const {
    msg,
    msg: {
      member,
      author:
                {
                  id: authorId,
                },
      channel,
    },
  } = args;
  if (!member) return;

  const firstMentionedUser = FindMemberInServer(msg) || member;
  const userId = firstMentionedUser ? firstMentionedUser.id : authorId;

  const funResult = await FunResult.findOne({ userID: userId }) || new FunResult({ userID: userId });

  return channel.send(
    Embed.createMessage(
      `${MentionUser(userId)} has **${funResult.deathmatchWins}** deathmatch wins.`,
    ),
  );
};

export default DeathmatchWins;
