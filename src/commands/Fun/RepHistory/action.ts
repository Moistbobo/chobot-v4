import Discord from 'discord.js';
import { CommandArgs } from '../../../types/CommandArgs';
import FindMemberInServer from '../../../helpers/FindMemberInServer';
import { RepHistory } from '../../../types/db/RepHistory';
import Embed from '../../../helpers/Embed';
import MentionUser from '../../../helpers/MentionUser';
import Tools from './Tools';

const action = async (args:CommandArgs) => {
  const {
    msg,
    msg: {
      member,
      author:
              {
                id: authorId,
              },
      channel,
    },
  } = args;
  if (!member) return;

  const firstMentionedUser = FindMemberInServer(msg) || member;
  const resultsPerPage = 5;


  const userId = firstMentionedUser ? firstMentionedUser.id : authorId;

  const userRepHistory = await RepHistory.find({ userId }).sort({ time: -1 });

  if (userRepHistory.length === 0) {
    const embed = Embed.createEmbed({
      thumbnail: firstMentionedUser.user.avatarURL() || firstMentionedUser.user.defaultAvatarURL,
      contents: `${MentionUser(userId)} has no Reputation history`,
    });
    return channel.send(embed);
  }

  if (userRepHistory.length < resultsPerPage) {
    const embed = Embed.createEmbed({
      title: `${firstMentionedUser.displayName}'s Reputation History`,
      thumbnail: firstMentionedUser.user.avatarURL() || firstMentionedUser.user.defaultAvatarURL,
      contents: Tools.renderHistoryItem(userRepHistory),
    });

    return channel.send(embed);
  }

  let index = 0;

  const filter = (
    reaction: any, user:any,
  ) => (reaction.emoji.name === '⬅' || reaction.emoji.name === '➡') && !user.bot;

  const embed = Embed.createEmbed({
    title: `${firstMentionedUser.displayName}'s Reputation History`,
    thumbnail: firstMentionedUser.user.avatarURL() || firstMentionedUser.user.defaultAvatarURL,
    contents: Tools.renderHistoryItem(userRepHistory.slice(index, index + resultsPerPage)),
    footer: `Page ${index + 1}/${Math.ceil(userRepHistory.length / resultsPerPage)}`,
  });

  const firstMessage = await channel.send(embed) as Discord.Message;

  await firstMessage.react('⬅');
  await firstMessage.react('➡');
  const reactionCollector = firstMessage.createReactionCollector(filter, { time: 30000 });

  reactionCollector.on('collect', (reaction: any, user: Discord.GuildMember) => {
    if (reaction.emoji.name === '⬅') {
      index = Math.max(index - 1, 0);
    } else {
      index = Math.min(userRepHistory.length / resultsPerPage, index + 1);
    }

    const newEmbed = Embed.createEmbed({
      title: `${firstMentionedUser.displayName}'s Reputation History`,
      thumbnail: firstMentionedUser.user.avatarURL() || firstMentionedUser.user.defaultAvatarURL,
      contents: Tools.renderHistoryItem(userRepHistory.slice(index * resultsPerPage, (index + 1) * resultsPerPage)),
      footer: `Page ${index + 1}/${Math.ceil(userRepHistory.length / resultsPerPage)}`,
    });

    firstMessage.edit(newEmbed);
  });
};

export default action;
