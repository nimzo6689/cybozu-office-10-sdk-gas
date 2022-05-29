import Consts from '../common/Constants';
import CybozuTransport from '../common/Transport';

/**
 * File* （ファイル管理） ページの情報を JavaScript オブジェクトとして取得する。
 */
export default class FileClient {
  _pagePrefix: string;
  _transport: CybozuTransport;

  /**
   * FileClient コンストラクタ関数
   *
   * @param transport  - サイボウズOffice10への通信オブジェクト
   */
  constructor(transport: CybozuTransport) {
    this._transport = transport;
  }

  /**
   * ファイルをダウンロード
   *
   * @param fileName  - ファイル名（）
   * @param query     - クエリ文字列
   * @param encoding  - 文字コード（utf-8, Shift_JIS）
   * @return ファイルのコンテント
   */
  download(fileName: string, query: string, encoding: string = Consts.UTF_8): string {
    return this._transport.getFile(fileName, query, encoding);
  }
}
