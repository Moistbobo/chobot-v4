import fetch from 'node-fetch';
import cheerio from 'cheerio';
import parser from 'fast-xml-parser';
import { CommandArgs } from '../../../models/CommandArgs';
import Embed from '../../../helpers/Embed';

const rssFeedUrl = 'https://community.blackdesertonline.com/index.php?forums/patch-notes.5/index.rss';
const updatesUrl = 'https://www.blackdesertonline.com/news/list/update';
const linkElement = 'list_news';

const getPatchNotesNew = (args: any) => {
  fetch(updatesUrl)
    .then((result) => result.text())
    .then((xml) => {
      const $ = cheerio.load(xml);
      const listNews = $('a[class=link_news]').toArray();
      const newsStrings = $('strong[class=subject_news]').toArray();

      // for (let i = 0; i < listNews.length; i++) {
      //   const newsString = newsStrings[i].children[0].data;
      //   const link = listNews[i].attribs.href;
      //   const newsLink = `https://www.blackdesertonline.com${link}`;
      //
      //   console.log(newsString, newsLink);
      // }

      let pnString = '';
      let link = '';

      for (let i = 0; i < listNews.length && pnString === ''; i++) {
        if (newsStrings[i]?.children[0]?.data?.includes('Patch')) {
          pnString = newsStrings[i]?.children[0]?.data || '';
          link = listNews[i].attribs.href;
        }
      }

      const newsLink = `https://www.blackdesertonline.com${link}`;

      return args.msg.channel.send(
        Embed.createEmbed({
          contents: `${pnString}\n${newsLink}`,
        }),
      );
    })
    .catch((err) => {
      Embed.createEmbed({
        contents: 'A network error occurred while retrieving patchnotes',
      }, true);
    });
};

const getPatchNotesLegacy = (args: any) => {
  const history = Math.min((parseFloat(args.message.content) || 1), 10);

  fetch(rssFeedUrl)
    .then((result) => result.text())
    .then((xml) => {
      const tobj = parser.getTraversalObj(xml);
      const json = parser.convertToJson(tobj);

      const pn = json.rss.channel.item;

      let pnString = '';

      for (let i = 0; i < history; i++) {
        pnString += `${pn[i].title}\n${pn[i].link} \n\n`;
      }

      const embedArgs = {
        title: 'Patch Notes',
        contents: pnString,
      };
      return args.msg.channel.send(
        Embed.createEmbed(embedArgs),
      );
    })
    .catch((err) => args.msg.channel.send(
      Embed.createEmbed({
        contents: 'A network error occurred while retrieving patchnotes',
      }, true),
    ));
};

const action = (args: CommandArgs) => {
  const history = Math.min((parseFloat(args.msg.content) || 1), 10);

  if (history === 1) {
    getPatchNotesNew(args);
  } else if (history > 1) {
    getPatchNotesLegacy(args);
  }
};

export default action;
