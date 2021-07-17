/**
 * File* （ファイル管理） ページの情報を JavaScript オブジェクトとして取得する。
 */
export default class FileClient {
  /**
   * CybozuOffice コンストラクタ関数
   *
   * @constructor
   * @param {CybozuTransport} transport  - サイボウズOffice10への通信オブジェクト
   */
  constructor(transport) {
    this._transport = transport;
  }

  /**
   * ファイルをダウンロード
   *
   * @param {number} fileName  - ファイル名（）
   * @param {number} query     - クエリ文字列
   * @param {number} encoding  - 文字コード（utf-8, Shift_JIS）
   */
  download(fileName, query, encoding = Consts.UTF_8) {
    return this._transport.getFile(fileName, query, encoding);
  }
}
