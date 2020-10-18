import { CommandArgs } from '../../../types/CommandArgs';
import Embed from '../../../helpers/Embed';
import { GenshinGachaBanner } from '../../../types/db/GenshinGachaBanner';

const action = async (args: CommandArgs) => {
  const {
    msg: {
      channel,
    },
  } = args;

  const genshinBanners = await GenshinGachaBanner.find({});

  if (!genshinBanners) {
    return channel.send('Could not retrieve any banners.');
  }

  return channel.send({
    embed: Embed.createEmbed({
      contents: `${genshinBanners.map((x, index) => `${index + 1}: ${x.name}\n`)}`.replace(/,/g, ''),
    }),
  });
};

export default action;
