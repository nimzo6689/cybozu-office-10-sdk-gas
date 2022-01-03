import Consts from '../common/Constants';
import CybozuTransport from '../common/Transport';

/**
 * File* （ファイル管理） ページの情報を JavaScript オブジェクトとして取得する。
 */
export default class FileClient {
  _pagePrefix: string;
  _transport: CybozuTransport;

  constructor(transport: CybozuTransport) {
    this._transport = transport;
  }

  download(fileName: string, query: string, encoding: string = Consts.UTF_8): string {
    return this._transport.getFile(fileName, query, encoding);
  }
}
