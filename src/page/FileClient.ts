import Consts from '../common/Constants';
import CybozuTransport from '../common/Transport';

/**
 * File* （ファイル管理） ページの情報を JavaScript オブジェクトとして取得する。
 */
export default class FileClient {
  _pagePrefix: string;
  _transport: CybozuTransport;
  /**
   * CybozuOffice コンストラクタ関数
   *
   * @constructor
   * @param {CybozuTransport} transport  - サイボウズOffice10への通信オブジェクト
   */
  constructor(transport: CybozuTransport) {
    this._transport = transport;
  }

  /**
   * ファイルをダウンロード
   *
   * @param {string} fileName  - ファイル名（）
   * @param {string} query     - クエリ文字列
   * @param {string} encoding  - 文字コード（utf-8, Shift_JIS）
   * @return {string} ファイルのコンテント
   */
  download(fileName: string, query: string, encoding: string = Consts.UTF_8): string {
    return this._transport.getFile(fileName, query, encoding);
  }
}