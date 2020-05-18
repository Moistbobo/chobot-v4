import * as Discord from 'discord.js';

const FindMemberInServer = (msg: Discord.Message): Discord.GuildMember | null => {
  const { content, guild: { members } } = msg;

  const splitMessage = content.split(' ').map((x) => x.trim());

  if (splitMessage.length < 2) return null;

  let mentionedUser = msg.mentions.members.first();

  if (!mentionedUser) {
    mentionedUser = members.find((
      member: Discord.GuildMember,
    ) => member.user.username.toLowerCase() === splitMessage[1].toLowerCase() || member.nickname === splitMessage[1]);
  }

  console.log('[ID Search:]', mentionedUser);
  return mentionedUser;
};

export default FindMemberInServer;
