import CybozuTransport from './common/Transport';
import MessageClient from './page/MessageClient';
import FileClient from './page/FileClient';
import UserClient from './page/UserClient';
import FolderClient from './page/FolderClient';
import BulletinClient from './page/BulletinClient';

/**
 * Cybozu Office 10 の操作 API を提供。
 *
 */
export class CybozuOffice {
  _transport: CybozuTransport;
  message: MessageClient;
  file: FileClient;
  user: UserClient;
  folder: FolderClient;
  bulletin: BulletinClient;

  constructor(baseUrl: string, accountId: string, password: string, sleepSec: number = 1) {
    this._transport = new CybozuTransport(baseUrl, accountId, password, sleepSec);

    this.message = new MessageClient(this._transport);
    this.file = new FileClient(this._transport);
    this.user = new UserClient(this._transport);
    this.folder = new FolderClient(this._transport);
    this.bulletin = new BulletinClient(this._transport);
  }
}

global.CybozuOffice = CybozuOffice;
