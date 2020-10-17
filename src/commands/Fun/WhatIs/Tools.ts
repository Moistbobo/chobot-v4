import Accolade from '../../../types/db/AccoladeType';

const accoladeLookup = async (accoladeName: string, serverId: string) => Accolade.findOne({ serverId, name: accoladeName })
  .collation({ locale: 'en', strength: 2 });

export default {
  accoladeLookup,
};
