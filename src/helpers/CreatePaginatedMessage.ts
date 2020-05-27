import Discord from 'discord.js';

const CreatePaginatedMessage = async ({
  message,
  onChange,
  resultsPerPage,
  maxLength,
  timeout,
}: {
  message: Discord.Message;
  onChange: (index: number, paginationHelper: () => any) => void;
  resultsPerPage: number;
  maxLength: number;
  timeout?: number;
}) => {
  let index = 0;
  await message.react('⬅');
  await message.react('➡');

  const filter = (reaction: any, user: any) => (reaction.emoji.name === '⬅' || reaction.emoji.name === '➡') && !user.bot;

  const reactionCollector = message.createReactionCollector(filter, {
    time: timeout || 30000,
  });

  reactionCollector.on(
    'collect',
    (reaction: any, user: Discord.GuildMember) => {
      if (reaction.emoji.name === '⬅') {
        index = Math.max(index - 1, 0);
      } else {
        index = Math.floor(Math.min(maxLength / resultsPerPage, index + 1));
      }
      onChange(index);
    },
  );
};

export default CreatePaginatedMessage;
