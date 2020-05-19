import moment from 'moment';
import Tools from './tools';
import TTSTools from '../TTSTools';
import { CommandArgs } from '../../../models/CommandArgs';
import Embed from '../../../helpers/Embed';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const action = async (args: CommandArgs) => {
  const {
    msg: {
      member: { voiceChannel },
      content,
      guild: { id: serverId },
    },
    voiceConnections,
  } = args;

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
    voiceConnections[serverId].session.playFile(`./gtts/${serverId}.wav`);
  } catch (err) {
    console.log('Error occurred', err.message);
  }
};

export default action;
