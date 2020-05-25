import moment from 'moment';
import { MessageAttachment } from 'discord.js';
import Tools from './tools';
import { CommandArgs } from '../../../models/CommandArgs';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const action = async (args: CommandArgs) => {
  const {
    msg: {
      channel,
      member,
      guild,
      content,
    },
    voiceConnections,
  } = args;

  if (!member || !guild) return;

  const {
    id: serverId,
  } = guild;

  const {
    voice: {
      channel: voiceChannel,
    },
  } = member;

  if (!voiceChannel) return;

  const lang = Tools.getLanguage(content);
  const gender = Tools.getGender(content);
  const textToSpeak = lang
    ? content.split(' ').slice(2).join(' ')
    : content.split(' ').slice(1).join(' ');

  const ttsAudioBinary = await Tools.generateTTS(textToSpeak, lang, gender);
  await Tools.writeTTSBinaryToWAVFile(ttsAudioBinary, serverId, member.id);

  const attachment = new MessageAttachment(`./gtts/${serverId}-${member.id}.wav`, 'tts.wav');

  await channel.send('', attachment);
};

export default action;
