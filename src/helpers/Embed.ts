import * as Discord from 'discord.js';
import { EmbedArgs } from '../models/EmbedArgs';

const createEmbed = (args: EmbedArgs, error = false) => {
  const {
    footer, contents, author, url, title, image, thumbnail,
    extraFields,
  } = args;

  const embed = new Discord.RichEmbed()
    .setColor(error ? '#f08080' : '#499369');

  if (footer) embed.setFooter(footer);
  if (contents) embed.setDescription(contents);
  if (title) embed.setTitle(title);
  if (author) embed.setAuthor(author);
  if (url) embed.setURL(url);
  if (image) embed.setImage(image);
  if (thumbnail) embed.setThumbnail(thumbnail);

  if (extraFields) {
    extraFields.forEach((ef) => {
      if (ef !== null) {
        if (ef.name === 'blank') {
          embed.addBlankField(ef.inline);
        } else {
          embed.addField(
            ef.name || '',
            ef.value || '',
            ef.inline || false,
          );
        }
      }
    });
  }

  return embed;
};

const createMessage = (contents: string, isError?: boolean) => createEmbed({ contents }, isError);

export default {
  createEmbed,
  createMessage,
};
