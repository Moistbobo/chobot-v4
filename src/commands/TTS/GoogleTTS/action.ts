import moment from 'moment';
import Tools from './tools';
import { CommandArgs } from '../../../types/CommandArgs';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const action = async (args: CommandArgs) => {
  const {
    msg: {
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
  await Tools.writeTTSBinaryToWAV(ttsAudioBinary, serverId);

  try {
    const lastActivity = voiceConnections[serverId]?.lastActivity;

    // reconnect to voice channel if past threshold
    // temp fix for voice channel glitch
    if (lastActivity) {
      if (moment(moment()).diff(lastActivity, 'minute') > 30) {
        voiceConnections[serverId].session.disconnect();
        await sleep(500);
      }
    }

    voiceConnections[serverId] = {
      session: await voiceChannel.join(),
      channel: voiceChannel,
      lastActivity: moment().toISOString(),
    };
    voiceConnections[serverId].session.play(`./gtts/${serverId}.wav`);
  } catch (err) {
    console.log('Error occurred', err.message);
  }
};

export default action;
