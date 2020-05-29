import { CommandArgs } from '../../../models/CommandArgs';
import FunResult from '../../../models/db/FunResult';
import Embed from '../../../helpers/Embed';
import MentionUser from '../../../helpers/MentionUser';

const action = async (args: CommandArgs) => {
  const { msg: { channel, guild, member } } = args;

  if (!guild || !member) return;

  const top10Wins = await FunResult.find({}).sort({ deathmatchWins: -1 }).limit(10);

  console.log(top10Wins);

  const embed = Embed.createEmbed({
    title: 'Top 10 Deathmatch wins',
    extraFields: top10Wins.map((x, index) => ({
      name: `Rank ${index + 1}`,
      value: `${MentionUser(x.userID)}\nWins: ${x.deathmatchWins}`,
    })),
  });

  return channel.send(embed);
};

export default action;
