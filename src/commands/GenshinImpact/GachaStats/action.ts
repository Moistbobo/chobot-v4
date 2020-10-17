import { CommandArgs } from '../../../types/CommandArgs';
import Embed from '../../../helpers/Embed';
import { GenshinUser } from '../../../types/db/GenshinUser';

const action = async (args: CommandArgs) => {
  const {
    msg: {
      channel, author, author: { id: authorId }
    },
  } = args;

  const genshinUser = await GenshinUser.findOne({ userId: authorId }) || new GenshinUser({
    userId: authorId,
  });

  const embed = Embed.createEmbed({
    title: 'Genshin Impact Gacha Sim Stats',
    extraFields: [
      {
        name: 'Total Rolls',
        value: genshinUser.totalRolls.toString(),
      },

      {
        name: '5* Obtained',
        value: genshinUser.SSRObtained.toString(),
        inline: true,
      },
      {
        name: '4* Obtained',
        value: genshinUser.SRObtained.toString(),
        inline: true,
      },
      {
        name: '3* Obtained',
        value: genshinUser.RObtained.toString(),
        inline: true,
      },
      {
        name: 'Primogems used',
        value: `${genshinUser.totalRolls * 160} <:primogem:767081753168707624>`,
        inline: true,
      },
      {
        name: 'Equivalent USD',
        value: `${((genshinUser.totalRolls * 160) * 0.01225247524).toFixed(2)}`,
        inline: true,
      },
    ],
    thumbnail: author.avatarURL({
      format: 'png',
    }) || author.defaultAvatarURL,
  });

  await channel.send(embed);
};

export default action;
