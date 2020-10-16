import { Message } from 'discord.js';
import moment from 'moment';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import { CommandArgs } from '../../../../types/CommandArgs';
import Embed from '../../../../helpers/Embed';
import MentionUser from '../../../../helpers/MentionUser';
import Accolade from '../../../../types/db/AccoladeType';

const collectorEndReasons = {
  ERROR: 'END_REASON/ERROR',
  SUCCESS: 'END_REASON/SUCCESS',
};

const action = async (args: CommandArgs) => {
  const { msg: { guild, member } } = args;

  if (!guild || !member) return;

  const {
    msg: {
      channel,
      channel: {
        id: channelId,
      },
      author: {
        id: authorId,
      },
    },
  } = args;

  const instructions = [
    'Enter the name of the new accolade',
    'Enter the type of the accolade (medal, ribbon, collectible)',
    'Enter the description of the accolade',
    'Enter the image link for the accolade',
  ];

  await channel.send(
    Embed.createMessage(
      `${MentionUser(authorId)}, you are about to create a new accolade type \`cancel\` at any time to stop. 
      \n\nType anything to continue.`,
    ),
  );

  const filter = (m:Message) => m.author.id === authorId;

  const messageCollector = channel.createMessageCollector(
    filter,
    {
      time: 60000,
    },
  );

  let collectCount = 0;

  const validAccoladeTypes = ['medal', 'ribbon', 'collectible'];

  const sanitizedCollected: string[] = [];

  messageCollector.on('collect', (m: Message) => {
    const msgContent = m.content;

    if (msgContent.toLowerCase() === 'cancel') {
      messageCollector.stop(collectorEndReasons.ERROR);
      channel.send(Embed.createMessage('Accolade creation cancelled'));
      return;
    }

    if (collectCount === 2) {
      if (!validAccoladeTypes.some((type) => type === msgContent)) {
        channel.send(Embed.createMessage(`Type should be one of the following: ${validAccoladeTypes.join((', '))}`));
        return;
      }
    }

    if (collectCount === 4) {
      if (!validator.isURL(msgContent)) {
        channel.send(Embed.createMessage('Image link should be a valid URL'));
        return;
      }
    }


    sanitizedCollected.push(msgContent);

    if (collectCount === instructions.length) {
      messageCollector.stop(collectorEndReasons.SUCCESS);
    } else {
      channel.send(Embed.createMessage(instructions[collectCount]));
      collectCount++;
    }
  });

  messageCollector.on('end', async (collected, reason) => {
    if (reason === collectorEndReasons.ERROR) return;

    const [name, type, description, img] = sanitizedCollected.slice(1);

    const newAccolade = new Accolade({
      serverId: guild.id,
      name,
      type,
      description,
      image: img,
      code: `${name[0]}-${uuidv4()}`,
    });

    await newAccolade.save();
    await channel.send(Embed.createMessage('New accolade created successfully'));
  });
};

export default action;
