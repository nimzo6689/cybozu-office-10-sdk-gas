/**
 * MyFolder* （個人フォルダ） ページの情報を JavaScript オブジェクトとして取得する。
 *
 */
export default class FolderClient {
  /**
   * CybozuOffice コンストラクタ関数
   *
   * @constructor
   * @param {CybozuTransport} transport  - サイボウズOffice10への通信オブジェクト
   */
  constructor(transport) {
    this._pagePrefix = "MyFolder";
    this._transport = transport;
  }

  /**
   * 個人フォルダのメッセージ一覧を取得
   *
   * @param {number|string} folderId - フォルダID（FID）
   * @param {number} reversed - 昇順フラグ（0は降順）
   */
  _index(folderId, reversed) {
    const query = {
      page: `${this._pagePrefix}Index`,
      FID: folderId,
      rv: reversed,
    };

    const document = this._transport.get(query);
    const rawMessages = document
      .toString()
      .match(/(?<=MyFolderMessageView).*?(?=profileImage)/gis);

    return rawMessages.map((rawHtml) => ({
      mDBID: rawHtml.match(/mDBID=(\d+)/i)
        ? Number(rawHtml.match(/mDBID=(\d+)/i)[1])
        : null,
      mDID: rawHtml.match(/mDID=(\d+)/i)
        ? Number(rawHtml.match(/mDID=(\d+)/i)[1])
        : null,
      subject: rawHtml.match(
        /(?<=clip8x16.png\" align=absmiddle>).*?(?=<\/a>)/i
      )[0],
    }));
  }

  /**
   * 受信箱のメッセージ一覧を取得
   *
   * @param {number} reversed - 昇順フラグ（0は降順）
   */
  inbox(reversed = 0) {
    return this._index("inbox", reversed);
  }

  /**
   * 送信箱のメッセージ一覧を取得
   *
   * @param {number} reversed - 昇順フラグ（0は降順）
   */
  sent(reversed = 0) {
    return this._index("sent", reversed);
  }

  /**
   * 下書きのメッセージ一覧を取得
   *
   * @param {number} reversed - 昇順フラグ（0は降順）
   */
  unsent(reversed = 0) {
    return this._index("unsent", reversed);
  }

  /**
   * 指定のフォルダ内のメッセージ一覧を取得
   *
   * @param {number} folderId - フォルダID（FID）
   * @param {number} reversed - 昇順フラグ（0は降順）
   */
  indexByFid(folderId, reversed = 0) {
    return this._index(folderId, reversed);
  }
}
