import { CommandArgs } from '../../../types/CommandArgs';
import Embed from '../../../helpers/Embed';
import { GenshinGachaBanner } from '../../../types/db/GenshinGachaBanner';
import { GenshinGachaItem } from '../../../types/db/GenshinGachaItem';

const action = async (args: CommandArgs) => {
  const {
    msg: {
      content,
      channel,
    },
  } = args;

  const trigger = content.split(' ')[0];

  const bannerName = content.replace(trigger, '').trim();

  const genshinBanner = await GenshinGachaBanner.findOne({ name_lower: bannerName.toLowerCase() });

  if (!genshinBanner) {
    return channel.send(`Could not find a banner called ${bannerName}`);
  }

  const featuredUnits = await GenshinGachaItem.find(
    { _id: { $in: genshinBanner.featuredItems } },
  );

  return channel.send({
    embed: Embed.createEmbed({
      title: genshinBanner.name,
      contents: `${genshinBanner.description} - Rate Ups\n\n${featuredUnits.sort(
        (a, b) => b.rarity - a.rarity,
      ).map(
        (x) => `${x.rarity}⭐ ${x.name}\n`,
      ).toString().replace(/,/g, '')}`,
      image: genshinBanner.bannerImg,
    }),
  });
};

export default action;
