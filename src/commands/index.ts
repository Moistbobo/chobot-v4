import BDO from './BDO/BDOCommands';
import MiscCommands from './Misc/MiscCommands';
import FunCommands from './Fun/FunCommands';
import TTSCommands from './TTS/TTSCommands';
import AdminCommands from './Admin/AdminCommands';
import GenshinImpactCommands from './GenshinImpact/GenshinImpactCommands';

export default [
  ...BDO,
  ...MiscCommands,
  ...FunCommands,
  ...TTSCommands,
  ...AdminCommands,
  ...GenshinImpactCommands,
];
