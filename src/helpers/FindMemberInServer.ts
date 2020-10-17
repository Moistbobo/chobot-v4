import * as Discord from 'discord.js';

const FindMemberInServer = (msg: Discord.Message): Discord.GuildMember | null | undefined => {
  const { content, guild } = msg;

  const splitMessage = content.split(' ').map((x) => x.trim());

  if (splitMessage.length < 2) return null;
  if ((guild && !guild.available) || !guild) return null;

  const { members } = guild;

  let mentionedUser = msg.mentions.members && msg.mentions.members.first();
  if (!mentionedUser) {
    mentionedUser = members.cache.find((
      member: Discord.GuildMember,
    ) => member.user.username.toLowerCase() === splitMessage[1].toLowerCase() || member.nickname === splitMessage[1]);
  }

  return mentionedUser;
};

export default FindMemberInServer;
