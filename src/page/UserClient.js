const cheerio = require('cheerio');

/**
 * UserList* （ユーザ名簿） ページの情報を JavaScript オブジェクトとして取得する。
 *
 */
export default class UserClient {
  /**
   * CybozuOffice コンストラクタ関数
   *
   * @constructor
   * @param {CybozuTransport} transport  - サイボウズOffice10への通信オブジェクト
   */
  constructor(transport) {
    this._pagePrefix = 'UserList';
    this._transport = transport;
  }

  /**
   * グループ ID に所属する UID リストの取得
   *
   * @param {number} gid - グループID
   * @return {number[]} 所属ユーザの UID リスト
   */
  index(gid) {
    const query = {
      page: `${this._pagePrefix}Index`,
      GID: gid,
    };

    const document = this._transport.get(query);
    const $ = cheerio.load(document);

    return $('table.dataList tr > td:nth-child(1)  a')
      .map((i, elem) => {
        const parsed = $(elem);
        return {
          uID: Number(parsed.attr('href').match(/(?<=uid=)[0-9]+/i)[0]),
          userName: parsed.text(),
        };
      })
      .toArray()
      .filter(e => e.uID !== 0);
  }
}
