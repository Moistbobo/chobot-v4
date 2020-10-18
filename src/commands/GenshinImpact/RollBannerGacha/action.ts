import Jimp from 'jimp';
import Discord from 'discord.js';
import { CommandArgs } from '../../../types/CommandArgs';
import { GenshinGachaItem } from '../../../types/db/GenshinGachaItem';
import Embed from '../../../helpers/Embed';
import { GenshinUser } from '../../../types/db/GenshinUser';
import { GenshinGachaBanner } from '../../../types/db/GenshinGachaBanner';

const getRandomItemFromCollection = (collection: any[]) => {
  const randNum = Math.floor(Math.random() * collection.length);
  return collection[randNum];
};

const action = async (args: CommandArgs) => {
  const {
    msg: {
      content, channel, author: { id: authorId }, id: messageId,
    },
  } = args;

  const trigger = content.split(' ')[0];

  const bannerName = content.replace(trigger, '').trim();

  const banner = await GenshinGachaBanner.findOne({ name_lower: bannerName.toLowerCase() });

  if (!banner) {
    return channel.send({
      embed: Embed.createEmbed({
        contents: `No banner found for ${bannerName}`,
      }),
    });
  }

  const genshinUser = await GenshinUser.findOne({ userId: authorId }) || new GenshinUser({
    userId: authorId,
  });

  const allGachaItems = await GenshinGachaItem.find();
  const featuredGachaItems = await GenshinGachaItem.find({
    _id: { $in: banner.featuredItems },
  });

  const { SSRPityThreshold, type } = banner;

  const featuredSSRCharacters = featuredGachaItems.filter((x) => x.rarity === 5);
  const featuredSRCharacters = featuredGachaItems.filter((x) => x.rarity === 4);
  const featuredSSRIds = featuredSSRCharacters.map((x) => x.id);

  const SSRCharacters = allGachaItems.filter(
    (x) => x.type === type && !x.bannerExclusive && x.rarity === 5 && !featuredSSRCharacters.includes(x.id),
  );
  const SRCharacters = allGachaItems.filter(
    (x) => !x.bannerExclusive && x.rarity === 4 && !featuredSRCharacters.includes(x.id),
  );
  const RItems = allGachaItems.filter((x) => !x.bannerExclusive && x.rarity === 3);

  // Generate the rolled image
  let img = new Jimp(640, 256, '#C0C0C0');
  // build results of 10 rolls

  let obtainedPity = false;

  const featuredOrStandardPool = (rarity: number) => {
    if (Math.random() < 0.5) {
      return rarity === 5 ? featuredSSRCharacters : featuredSRCharacters;
    }
    return rarity === 5 ? SSRCharacters : SRCharacters;
  };

  const processSetBannerPity = () => {
    const rolledItem = getRandomItemFromCollection(featuredOrStandardPool(5));

    if (featuredSSRIds.includes(rolledItem.id)) {
      genshinUser.bannerSSRObtained.set(bannerName.toLowerCase(), 2);
    }

    return rolledItem;
  };

  const rolls = new Array(10).fill(0).map(() => Math.random()).map((result, index) => {
    const pityRolls = genshinUser.bannerPity.get(bannerName.toLowerCase());
    genshinUser.totalRolls += 1;
    if (!pityRolls) {
      genshinUser.totalPity += 1;
      genshinUser.bannerPity.set(bannerName.toLowerCase(), 1);
    } else {
      genshinUser.bannerPity.set(bannerName.toLowerCase(), pityRolls + 1);
    }

    if (pityRolls + 1 >= SSRPityThreshold) {
      obtainedPity = true;
      genshinUser.bannerPity.set(bannerName.toLowerCase(), 0);

      if (genshinUser.bannerSSRObtained.get(bannerName.toLowerCase()) === 2) {
        return getRandomItemFromCollection(featuredOrStandardPool(5));
      }

      // Check if User has reached the second pity
      if (genshinUser.bannerSSRObtained.get(bannerName.toLowerCase()) === 1) {
        genshinUser.bannerSSRObtained.set(bannerName.toLowerCase(), 2);

        return getRandomItemFromCollection(featuredSSRCharacters);
      }

      const rolledSSRChar = getRandomItemFromCollection(featuredOrStandardPool(5));

      if (featuredSSRIds.includes(rolledSSRChar.id)) {
        genshinUser.bannerSSRObtained.set(bannerName.toLowerCase(), 2);
      } else {
        genshinUser.bannerSSRObtained.set(bannerName.toLowerCase(), 1);
      }

      return rolledSSRChar;
    }

    if (index === 9) {
      // guarenteed 4* or above
      if (result <= 0.006) return processSetBannerPity();

      return getRandomItemFromCollection(featuredOrStandardPool(4));
    }
    if (result <= 0.006) return processSetBannerPity();
    if (result > 0.006 && result < 0.051) return getRandomItemFromCollection(featuredOrStandardPool(4));
    return getRandomItemFromCollection(RItems);
  });

  // Load all character images into jimp files
  // @ts-ignore
  const promises = rolls.sort((a, b) => b.rarity - a.rarity).map((item) => Jimp.read(item.image));

  const loadedImages = await Promise.all(promises);

  // Append rarity to items
  const RImage = await Jimp.read('https://i.imgur.com/OLSC6ch.png');
  const SRImage = await Jimp.read('https://i.imgur.com/RdCuZrT.png');
  const SSRImage = await Jimp.read('https://i.imgur.com/ha9PzbY.png');

  const mapRarityImage = (rarity: number): Jimp => {
    if (rarity === 5) {
      genshinUser.SSRObtained += 1;
      return SSRImage;
    }
    if (rarity === 4) {
      genshinUser.SRObtained += 1;
      return SRImage;
    }

    genshinUser.RObtained += 1;
    return RImage;
  };

  const itemsWithRarity = [
    ...loadedImages.map(
      (x, index) => {
        const rolledItemId = rolls[index].id;
        const rolledItemCount = genshinUser.rollHistory.get(rolledItemId) || 0;

        genshinUser.rollHistory.set(
          rolledItemId, rolledItemCount + 1,
        );

        const rareImage = mapRarityImage(rolls[index].rarity);
        x.resize(108, 108);
        return x.composite(
          rareImage,
          (x.getWidth() / 2) - (rareImage.getWidth() / 2),
          x.getHeight() * 0.8,
        );
      },
    ),
  ];

  let xSpacing = 0;
  rolls.forEach((item, index) => {
    const x = xSpacing + 8;
    const y = (Math.floor(index / 5) * 128) + 8;

    img = img.composite(itemsWithRarity[index], x, y);

    if (index === 4) xSpacing = 8;
    else xSpacing += 128;
  });

  await img.writeAsync(`./ggrolls/${authorId}.png`);
  const attachment = new Discord.MessageAttachment(`./ggrolls/${authorId}.png`, `ggroll-${authorId}.png`);

  const embed = Embed.createEmbed({
    contents: `${obtainedPity ? `Reached pity threshold (${SSRPityThreshold})` : ''}\nPity counter: ${genshinUser.bannerPity.get(bannerName.toLowerCase())}/${banner.SSRPityThreshold}`,
    footer: genshinUser.bannerSSRObtained.get(bannerName.toLowerCase()) === 2 ? 'Banner Pity Awarded ✅' : '',
    image: `attachment://ggroll-${authorId}.png`,
    file: attachment,
  });

  await genshinUser.save();

  await channel.send({
    embed,
  });
};

export default action;
