import Jimp from 'jimp';
import Discord from 'discord.js';
import { CommandArgs } from '../../../types/CommandArgs';
import { GenshinGachaItem } from '../../../types/db/GenshinGachaItem';
import Embed from '../../../helpers/Embed';

const getRandomItemFromCollection = (collection: any[]) => {
  const randNum = Math.floor(Math.random() * collection.length);
  console.log(randNum);
  return collection[randNum];
};

const action = async (args: CommandArgs) => {
  const { msg: { channel, author, id: authorId } } = args;

  const gachaItems = await GenshinGachaItem.find();
  const SSRCharacters = gachaItems.filter((x) => x.rarity === 5);
  const SRCharacters = gachaItems.filter((x) => x.rarity === 4);
  const RItems = gachaItems.filter((x) => x.rarity === 3);

  // Generate the rolled image
  let img = new Jimp(640, 256, '#C0C0C0');
  const genericRItem = new Jimp(128, 128, '#000');
  // build results of 10 rolls

  const rolls = new Array(10).fill(0).map(() => Math.random()).map((result, index) => {
    if (index === 9) {
      if (result <= 0.006) return getRandomItemFromCollection(SSRCharacters);
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
    if (rarity === 5) return SSRImage;
    if (rarity === 4) return SRImage;
    return RImage;
  };

  const itemsWithRarity = [
    ...loadedImages.map(
      (x, index) => {
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
    contents: 'test',
    image: `attachment://ggroll-${authorId}.png`,
    file: attachment,
  });

  await channel.send({
    embed,
  });
};

export default action;
