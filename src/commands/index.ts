import BDO from './BDO/BDOCommands';
import MiscCommands from './Misc/MiscCommands';
import FunCommands from './Fun/FunCommands';
import TTSCommands from './TTS/TTSCommands';
import AdminCommands from './Admin/AdminCommands';

export default [
  ...BDO,
  ...MiscCommands,
  ...FunCommands,
  ...TTSCommands,
  ...AdminCommands,
];
