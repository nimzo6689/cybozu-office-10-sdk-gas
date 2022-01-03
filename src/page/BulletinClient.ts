import Consts from '../common/Constants';
import { Utils } from '../common/Helpers';
import CybozuTransport from '../common/Transport';

/**
 * Bulletin* （掲示板） ページの情報を JavaScript オブジェクトとして取得する。
 */
export default class BulletinClient {
  _pagePrefix: string;
  _transport: CybozuTransport;

  constructor(transport: CybozuTransport) {
    this._pagePrefix = 'Bulletin';
    this._transport = transport;
  }

  addFollow(bid: string, data: string, group: string = Consts.DEFAULT_GROUP_NAME): boolean {
    const body = {
      page: `Ajax${this._pagePrefix}FollowAdd`,
      EditMode: Consts.MessageEditMode.TEXT,
      Group: group,
      Data: data,
      BID: bid,
    };

    this._transport.post(Utils.buildQuery(body));
    return true;
  }
}
