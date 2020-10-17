import moment from 'moment';
import { IRepHistory } from '../../../types/db/RepHistory';
import MentionUser from '../../../helpers/MentionUser';

const renderHistoryItem = (repHistory: IRepHistory[]) => repHistory.map(
  (
    x,
  ) => `${x.isIncrease ? '⬆ Increase' : '⬇ Decrease'}\nSender: ${MentionUser(x.senderId)} \nSent on: ${moment(x.time).format('MM-DD-YYYY')}`,
).join('\n\n');

export default {
  renderHistoryItem,
};
