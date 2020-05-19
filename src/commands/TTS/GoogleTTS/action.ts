import Tools from './tools';
import { CommandArgs } from '../../../models/CommandArgs';

const action = async (args: CommandArgs) => {
  const {
    msg: {
      member: { voiceChannel },
      content,
      guild: { id: serverId },
    },
    voiceConnections,
  } = args;

  if (content.split.length < 2 || !voiceChannel) return;

  const lang = Tools.getLanguage(content);
  const gender = Tools.getGender(content);
  const textToSpeak = lang
    ? content.split(' ').slice(2).join(' ')
    : content.split(' ').slice(1).join(' ');

  const ttsAudioBinary = await Tools.generateTTS(textToSpeak, lang, gender);
  await Tools.writeTTSBinaryToWAV(ttsAudioBinary, serverId);

  try {
    voiceConnections[serverId] = await voiceChannel.join();
    voiceConnections[serverId].playFile(`./gtts/${serverId}.wav`);
  } catch (err) {
    console.log('Error occurred', err.message);
  }
};

export default action;
