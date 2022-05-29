import CybozuTransport from '../common/Transport';

/**
 * MyFolder* （個人フォルダ） ページの情報を JavaScript オブジェクトとして取得する。
 *
 */
export default class FolderClient {
  _pagePrefix: string;
  _transport: CybozuTransport;

  /**
   * CybozuOffice コンストラクタ関数
   *
   * @param transport  - サイボウズOffice10への通信オブジェクト
   */
  constructor(transport: CybozuTransport) {
    this._pagePrefix = 'MyFolder';
    this._transport = transport;
  }

  /**
   * 個人フォルダのメッセージ一覧を取得
   *
   * @param folderId - フォルダID（FID）
   * @param reversed - 昇順フラグ（0は降順）
   */
  _index(folderId: number | string, reversed: number) {
    const query = {
      page: `${this._pagePrefix}Index`,
      FID: folderId,
      rv: reversed,
    };

    const document = this._transport.get(query);
    const rawMessages = document.toString().match(/(?<=MyFolderMessageView).*?(?=profileImage)/gis);

    return rawMessages?.map(rawHtml => ({
      mDBID: rawHtml.match(/mDBID=(\d+)/i) ? Number(rawHtml.match(/mDBID=(\d+)/i)[1]) : null,
      mDID: rawHtml.match(/mDID=(\d+)/i) ? Number(rawHtml.match(/mDID=(\d+)/i)[1]) : null,
      subject: rawHtml.match(/(?<=clip8x16.png\" align=absmiddle>).*?(?=<\/a>)/i)[0],
    }));
  }

  /**
   * 受信箱のメッセージ一覧を取得
   *
   * @param reversed - 昇順フラグ（0は降順）
   */
  inbox(reversed: number = 0) {
    return this._index('inbox', reversed);
  }

  /**
   * 送信箱のメッセージ一覧を取得
   *
   * @param reversed - 昇順フラグ（0は降順）
   */
  sent(reversed: number = 0) {
    return this._index('sent', reversed);
  }

  /**
   * 下書きのメッセージ一覧を取得
   *
   * @param reversed - 昇順フラグ（0は降順）
   */
  unsent(reversed: number = 0) {
    return this._index('unsent', reversed);
  }

  /**
   * 指定のフォルダ内のメッセージ一覧を取得
   *
   * @param folderId - フォルダID（FID）
   * @param reversed - 昇順フラグ（0は降順）
   */
  indexByFid(folderId: number, reversed: number = 0) {
    return this._index(folderId, reversed);
  }
}
