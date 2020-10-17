import { CommandArgs } from '../../../../types/CommandArgs';
import FindMemberInServer from '../../../../helpers/FindMemberInServer';
import AwardedAccolade from '../../../../types/db/AwardedAccolade';
import Embed from '../../../../helpers/Embed';

const action = async (args: CommandArgs) => {
  const {
    msg: {
      channel, guild, member, content,
    },
  } = args;

  const splitContent = content.split(' ');

  if (!guild || !member || splitContent.length < 2) return;

  const [, id] = splitContent;

  const accoladeToDelete = await AwardedAccolade.findOne({ serverId: guild.id, _id: id });
  if (!accoladeToDelete) {
    return channel.send(Embed.createMessage(`Could not find accolade Id \`${id}\``, true));
  }

  accoladeToDelete.isDeleted = true;

  await accoladeToDelete.save();

  return channel.send(Embed.createMessage('Accolade removed.'));
};

export default action;
