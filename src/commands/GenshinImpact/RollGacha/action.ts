import Jimp from 'jimp';
import Discord from 'discord.js';
import _ from 'lodash';
import { CommandArgs } from '../../../types/CommandArgs';
import { GenshinGachaItem } from '../../../types/db/GenshinGachaItem';
import Embed from '../../../helpers/Embed';
import { GenshinUser } from '../../../types/db/GenshinUser';

const getRandomItemFromCollection = (collection: any[]) => {
  const randNum = Math.floor(Math.random() * collection.length);
  return collection[randNum];
};

const action = async (args: CommandArgs) => {
  const { msg: { channel, author: { id: authorId }, id: messageId } } = args;

  const genshinUser = await GenshinUser.findOne({ userId: authorId }) || new GenshinUser({
    userId: authorId,
  });

  const gachaItems = await GenshinGachaItem.find();
  const SSRCharacters = gachaItems.filter((x) => x.rarity === 5);
  const SRCharacters = gachaItems.filter((x) => x.rarity === 4);
  const RItems = gachaItems.filter((x) => x.rarity === 3);

  // Generate the rolled image
  let img = new Jimp(640, 256, '#C0C0C0');
  // build results of 10 rolls

  let obtainedPity = false;

  const rolls = new Array(10).fill(0).map(() => Math.random()).map((result, index) => {
    const pityRolls = genshinUser.bannerPity.get('standard');
    genshinUser.totalRolls += 1;
    if (!pityRolls) {
      genshinUser.totalPity += 1;
      genshinUser.bannerPity.set('standard', 1);
    } else {
      genshinUser.bannerPity.set('standard', pityRolls + 1);
    }

    if (pityRolls + 1 >= 90) {
      obtainedPity = true;
      genshinUser.bannerPity.set('standard', 0);
      return getRandomItemFromCollection(SSRCharacters);
    }

    if (index === 9) {
      if (result <= 0.006) {
        genshinUser.bannerPity.set('standard', 0);
        return getRandomItemFromCollection(SSRCharacters);
      }
      return getRandomItemFromCollection(SRCharacters);
    }
    if (result <= 0.006) return getRandomItemFromCollection(SSRCharacters);
    if (result > 0.006 && result < 0.051) return getRandomItemFromCollection(SRCharacters);
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
    contents: obtainedPity ? 'Reached pity threshold (90)' : '',
    image: `attachment://ggroll-${authorId}.png`,
    file: attachment,
  });

  await genshinUser.save();

  await channel.send({
    embed,
  });
};

export default action;
