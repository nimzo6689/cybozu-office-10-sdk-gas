import cheerio from 'cheerio';

import CybozuTransport from '../common/Transport';

/**
 * UserList* （ユーザ名簿） ページの情報を JavaScript オブジェクトとして取得する。
 *
 */
export default class UserClient {
  _pagePrefix: string;
  _transport: CybozuTransport;

  constructor(transport: CybozuTransport) {
    this._pagePrefix = 'UserList';
    this._transport = transport;
  }

  /**
   * グループ ID に所属する UID リストの取得
   */
  index(gid: number): { uID: number }[] {
    const query = {
      page: `${this._pagePrefix}Index`,
      GID: gid,
    };

    const document = this._transport.get(query);
    const $ = cheerio.load(document);

    return $('table.dataList tr > td:nth-child(1)  a')
      .map((_: any, elem: any) => {
        const parsed = $(elem);
        return {
          uID: Number(parsed.attr('href').match(/(?<=uid=)[0-9]+/i)[0]),
          userName: parsed.text(),
        };
      })
      .toArray()
      .filter((e: { uID: number }) => e.uID !== 0);
  }
}
