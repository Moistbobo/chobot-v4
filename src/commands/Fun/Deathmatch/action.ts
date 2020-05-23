import { CommandArgs } from '../../../models/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import Embed from '../../../helpers/Embed';
import sleep from '../../../helpers/Sleep';
import MentionUser from '../../../helpers/MentionUser';
import FunResult from '../../../models/db/FunResult';

const action = async (args: CommandArgs) => {
  const {
    msg,
    msg: {
      channel,
      content,
      member,
      author: {
        id: authorId,
      },
    },
  } = args;

  const mentionedUser = FindMemberInServer(msg);

  if (!mentionedUser || !member) {
    return channel.send(Embed.createMessage('Specify someone to fight', true));
  }
  if (mentionedUser.id === authorId) {
    return channel.send(Embed.createMessage('You can\'t fight yourself', true));
  }

  let fighterAHp = 100;
  let fighterBHp = 100;

  let fighterATurn = Math.random() < 0.5;

  const intialEmbed = Embed.createEmbed({
    title: `${member.displayName} V.S ${mentionedUser.displayName}`,
    extraFields: [
      {
        name: `${member.displayName} HP`,
        value: `${fighterAHp}`,
        inline: true,
      },
      {
        name: `${mentionedUser.displayName} HP`,
        value: `${fighterBHp}`,
        inline: true,
      },
      {
        name: 'Battle Status',
        value: `The fight has begun ${fighterATurn
          ? `${MentionUser(authorId)}`
          : `${MentionUser(mentionedUser.id)}`} gets first move`,
      },
    ],
  });

  const fightMessage = await channel.send(intialEmbed);

  let oldMessage = '';

  while (fighterAHp > 0 && fighterBHp > 0) {
    await sleep(2000);

    const damage = Math.floor((Math.random() * 40) + 5);

    let newMessage = '';

    if (fighterATurn) {
      fighterBHp -= damage;
      newMessage = `${MentionUser(authorId)} has dealt ${damage} damage to ${MentionUser(mentionedUser.id)}`;
      // eslint-disable-next-line max-len
      oldMessage = `${member.displayName} has dealt ${damage} damage to ${mentionedUser.displayName}!`
        .concat('\n\n', oldMessage);
    } else {
      fighterAHp -= damage;
      newMessage = `${MentionUser(mentionedUser.id)} has dealt ${damage} damage to ${MentionUser(authorId)}`;
      // eslint-disable-next-line max-len
      oldMessage = `${mentionedUser.displayName} has dealt ${damage} damage to ${member.displayName}!`
        .concat('\n\n', oldMessage);
    }

    // const newEmbed = Embed.createEmbed({
    //   title: `${member.displayName} V.S ${mentionedUser.displayName}`,
    //   contents: `\`\`\`
    //   ${member.displayName} HP: ${fighterAHp}\n${mentionedUser.displayName} HP: ${fighterBHp}\n\n
    //   ${newMessage}\`\`\`\n\n
    //   \`\`\`Battle Log:\n\n${oldMessage}\`\`\``,
    // });

    const newEmbed = Embed.createEmbed({
      title: `${member.displayName} V.S ${mentionedUser.displayName}`,
      extraFields: [
        {
          name: `${member.displayName} HP`,
          value: `${fighterAHp}`,
          inline: true,
        },
        {
          name: '⠀⠀',
          value: `${fighterATurn ? '➡️' : '⬅️'}\n${damage}`,
          inline: true,
        },
        {
          name: `${mentionedUser.displayName} HP`,
          value: `${fighterBHp}`,
          inline: true,
        },
        {
          name: 'Battle Status',
          value: `${newMessage}`,
        },
      ],
    });

    await fightMessage.edit(newEmbed);

    fighterATurn = !fighterATurn;
  }

  await sleep(1500);

  const winMessage = fighterAHp > 0 ? `${MentionUser(authorId)} has defeated ${MentionUser(mentionedUser.id)}`
    : `${MentionUser(mentionedUser.id)} has defeated ${MentionUser(authorId)}`;

  const newEmbed = Embed.createEmbed({
    title: `${member.displayName} V.S ${mentionedUser.displayName}`,
    extraFields: [
      {
        name: `${member.displayName} HP`,
        value: `${fighterAHp}`,
        inline: true,
      },
      {
        name: `${mentionedUser.displayName} HP`,
        value: `${fighterBHp}`,
        inline: true,
      },
      {
        name: 'Battle Status',
        value: `🏆 ${winMessage} 🏆`,
      },
    ],
  });

  await fightMessage.edit(newEmbed);
};

export default action;
