import fetch from 'node-fetch';
import cheerio from 'cheerio';
import _ from 'lodash';
import { CommandArgs } from '../../../types/CommandArgs';
import Embed from '../../../helpers/Embed';

const updatesUrl = 'https://www.naeu.playblackdesert.com/en-US/News/Notice?boardType=2';

const getName = (element: any) => {
  console.log(element);
  return _.get(element, 'children[3].children[1].children[0].children[0].data');
};

const getLink = (element: any) => _.get(element, 'attribs.href');

const mapLinks = (links: any[]) => links.map(
  (x) => ({ name: getName(x), link: getLink(x) }),
)
  .filter((x) => x.name);

const getPatchNotesNew = async (args: any, history: number) => {
  try {
    const fetchResult = await fetch(updatesUrl);
    const resultsText = await fetchResult.text();
    const cheerioResult = cheerio.load(resultsText);

    const btnDetail = cheerioResult('a[name=btnDetail]').toArray();

    const newsLinks = mapLinks(btnDetail);

    newsLinks.length = history
      ? Math.min(history || newsLinks.length)
      : 1;

    const mappedLinks = newsLinks.map((x) => `${x.name}\n${x.link}`);

    return mappedLinks.join('\n\n');
  } catch (err:any) {
    console.log(err);
    return 'Unable to retrieve patch notes';
  }
};

const action = async (args: CommandArgs) => {
  const { msg: { content } } = args;

  const [, numPN] = content.split(' ');
  const history = Math.min((parseFloat(numPN) || 1), 15);

  const patchNotes = await getPatchNotesNew(args, history);

  return args.msg.channel.send(
    Embed.createEmbed({
      contents: patchNotes,
    }),
  );
};

export default action;
