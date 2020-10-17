import { CommandArgs } from '../../../types/CommandArgs';

const action = (args: CommandArgs) => {
  const { msg: { guild, channel } } = args;

  if (!guild) return;
};

export default action;
