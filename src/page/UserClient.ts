import cheerio from 'cheerio';

import CybozuTransport from '../common/Transport';

/**
 * UserList* （ユーザ名簿） ページの情報を JavaScript オブジェクトとして取得する。
 *
 */
export default class UserClient {
  _pagePrefix: string;
  _transport: CybozuTransport;

  /**
   * CybozuOffice コンストラクタ関数
   *
   * @param transport  - サイボウズOffice10への通信オブジェクト
   */
  constructor(transport: CybozuTransport) {
    this._pagePrefix = 'UserList';
    this._transport = transport;
  }

  /**
   * グループ ID に所属する UID リストの取得
   *
   * @param gid - グループID
   * @return 所属ユーザの UID リスト
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
