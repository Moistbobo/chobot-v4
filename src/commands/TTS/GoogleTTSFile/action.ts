import moment from 'moment';
import { MessageAttachment } from 'discord.js';
import Tools from './tools';
import { CommandArgs } from '../../../types/CommandArgs';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const action = async (args: CommandArgs) => {
  const {
    msg: {
      channel,
      member,
      author,
      guild,
      content,
    },
  } = args;

  if (!member || !guild) return;

  const {
    id: serverId,
  } = guild;

  const lang = Tools.getLanguage(content);
  const gender = Tools.getGender(content);
  const textToSpeak = lang
    ? content.split(' ').slice(2).join(' ')
    : content.split(' ').slice(1).join(' ');

  console.log('generating');
  const ttsAudioBinary = await Tools.generateTTS(textToSpeak, lang, gender);
  await Tools.writeTTSBinaryToWAVFile(ttsAudioBinary, serverId, author.id);

  console.log('uploading');
  const attachment = new MessageAttachment(`./gtts/${serverId}-${author.id}.mp3`, 'tts.mp3');

  await channel.send('', attachment);
};

export default action;
