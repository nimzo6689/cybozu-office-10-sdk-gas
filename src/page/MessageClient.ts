import cheerio from 'cheerio';

import Consts from '../common/Constants';
import { Utils } from '../common/Helpers';
import CybozuTransport from '../common/Transport';

/**
 * MyFolderMessage* （個人フォルダ内のメッセージ） ページの情報を JavaScript オブジェクトとして取得する。
 *
 */
export default class MessageClient {
  _pagePrefix: string;
  _transport: CybozuTransport;
  /**
   * CybozuOffice コンストラクタ関数
   *
   * @constructor
   * @param {CybozuTransport} transport  - サイボウズOffice10への通信オブジェクト
   */
  constructor(transport: CybozuTransport) {
    this._pagePrefix = 'MyFolderMessage';
    this._transport = transport;
  }

  /**
   * メッセージの送信
   *
   * @param {string} subject              - 標題
   * @param {string} data                 - コメント文
   * @param {Array}  uidList              - 宛先 UID リスト
   * @param {string} group                - コメントする際に表示されるグループ名
   * @param {number} editableByReceivers  - 宛先のユーザーにメッセージの変更を許可する（0: 無許可, 1: 許可）
   * @param {number} useConfirm           - 閲覧状況を確認する（0: 無効, 1: 有効）
   * @param {number} simpleReplyEnable    - リアクションを許可する（0: 無許可, 1: 許可）
   */
  send(
    subject: string,
    data: string,
    uidList: number[],
    group: string = Consts.DEFAULT_GROUP_NAME,
    editableByReceivers: number = 1,
    useConfirm: number = 0,
    simpleReplyEnable: number = 1
  ) {
    const uidPairs = uidList.map(uid => `UID=${uid}`).join('&');

    const body = {
      page: `${this._pagePrefix}Send`,
      EditMode: Consts.MessageEditMode.TEXT,
      Subject: subject,
      Group: group,
      Data: data,
      EditableByReceivers: editableByReceivers,
      UseConfirm: useConfirm,
      SimpleReplyEnable: simpleReplyEnable,
    };

    const encodedBody = `${Utils.buildQuery(body)}&${uidPairs}`;

    this._transport.post(encodedBody);
    return true;
  }

  /**
   * Not supported yet.
   */
  view(_mDBID: number, _mDID: number) {
    throw new Error('Not supported yet.');
  }

  /**
   * メッセージの移動
   *
   * @param {number} mDBID                - mDBID(0~9)
   * @param {number} mDID                 - MID 用の ID
   * @param {number} pID                  - PID 用の ID
   */
  move(mDBID: number, mDID: number, pID: number) {
    const body = {
      page: `${this._pagePrefix}View`,
      DBID: mDBID,
      MID: mDID,
      PID: pID,
      Submit: '移動する',
    };

    this._transport.post(Utils.buildQuery(body));
    return true;
  }

  /**
   * コメントを取得する
   *
   * @param {number} mDBID - mDBID(0~9)
   * @param {number} mDID  - MID 用のID
   * @param {number} hID   - OFFSET となる Follow ID
   * @return {Array} コメントリスト
   */
  viewFollows(mDBID: number, mDID: number, hID: number = null): Array<any> {
    const query = {
      page: `Ajax${this._pagePrefix}FollowNavi`,
      DBID: mDBID,
      MID: mDID,
    };
    if (hID) {
      query['hid'] = hID;
    }

    const document = this._transport.get(query);
    const $ = cheerio.load(document);

    return $('#Follows > div')
      .map((__: any, el: any) => {
        const parsed = $(el);

        const attached = parsed.find('.vr_viewContentsAttach td:first-child a').attr('href');
        let _: any, attachedFile: string, attachedQuery: string;
        if (attached) {
          [_, attachedFile, attachedQuery] = attached.split(/[/?]/);
          attachedQuery = attachedQuery.replace(/&amp;/gi, '&');
        }

        return {
          followId: Number(parsed.attr('id').match(/(?<=follow-root-)[0-9]+/i)[0]),
          userName: parsed.find('.vr_followUserName').text(),
          attachedFile: attachedFile,
          attachedQuery: attachedQuery,
        };
      })
      .toArray();
  }

  /**
   * メッセージの編集
   *
   * @param {number} mDBID                - mDBID(0~9)
   * @param {number} mDID                 - MID 用のID
   * @param {string} subject              - 標題
   * @param {string} data                 - コメント文
   * @param {string} group                - コメントする際に表示されるグループ名
   * @param {number} editableByReceivers  - 宛先のユーザーにメッセージの変更を許可する（0: 無許可, 1: 許可）
   * @param {number} useConfirm           - 閲覧状況を確認する（0: 無効, 1: 有効）
   * @param {number} simpleReplyEnable    - リアクションを許可する（0: 無許可, 1: 許可）
   */
  modify(
    mDBID: number,
    mDID: number,
    subject: string,
    data: string,
    group: string = Consts.DEFAULT_GROUP_NAME,
    editableByReceivers: number = 1,
    useConfirm: number = 0,
    simpleReplyEnable: number = 1
  ) {
    const body = {
      page: `${this._pagePrefix}Modify`,
      EditMode: Consts.MessageEditMode.TEXT,
      Subject: subject,
      Group: group,
      Data: data,
      EditableByReceivers: editableByReceivers,
      UseConfirm: useConfirm,
      SimpleReplyEnable: simpleReplyEnable,
      DBID: mDBID,
      MID: mDID,
      Submit: '変更する',
    };

    this._transport.post(Utils.buildQuery(body));
    return true;
  }

  /**
   * メッセージの削除
   *
   * @param {number} mDBID                - mDBID(0~9)
   * @param {number} mDID                 - MID 用のID
   */
  delete(mDBID: number, mDID: number) {
    const body = {
      page: `${this._pagePrefix}Delete`,
      DBID: mDBID,
      MID: mDID,
      Remove: 1,
      Yes: '移動する',
    };

    this._transport.post(Utils.buildQuery(body));
    return true;
  }

  /**
   * コメントを書き込む
   *
   * @param {number} mDBID - mDBID(0~9)
   * @param {number} mDID  - MID 用のID
   * @param {string} data  - コメント文
   * @param {string} group - グループ名
   */
  addFollow(mDBID: number, mDID: number, data: string, group: string = Consts.DEFAULT_GROUP_NAME) {
    const body = {
      page: `Ajax${this._pagePrefix}FollowAdd`,
      EditMode: Consts.MessageEditMode.TEXT,
      Group: group,
      Data: data,
      DBID: mDBID,
      MID: mDID,
    };

    this._transport.post(Utils.buildQuery(body));
    return true;
  }

  /**
   * コメントを削除する
   *
   * @param {number} mDBID     - mDBID(0~9)
   * @param {number} mDID      - MID 用のID
   * @param {number} followId  - follow ID
   */
  deleteFollow(mDBID: number, mDID: number, followId: number) {
    const body = {
      page: `Ajax${this._pagePrefix}FollowDelete`,
      FRID: followId,
      DBID: mDBID,
      MID: mDID,
    };

    this._transport.post(Utils.buildQuery(body));
    return true;
  }

  /**
   * いいね！
   *
   * @param {number} mDBID     - mDBID(0~9)
   * @param {number} mDID      - MID 用のID
   * @param {number} followId  - follow ID
   * @param {number} cancel    - キャンセルフラグ（0: 正常、 1: キャンセル）
   * @param {string} mark      - マーク（'good', 'ok', 'smile', 'sad'）
   */
  replySimple(mDBID: number, mDID: number, followId: number, cancel: number = 0, mark: string = null) {
    const body = {
      page: `AjaxSimpleReply`,
      Cancel: cancel,
      FRID: followId,
      DBID: mDBID,
      MID: mDID,
    };
    if (mark) {
      body['Value'] = mark;
    }

    this._transport.post(Utils.buildQuery(body));
    return true;
  }

  /**
   * 宛先を取得する
   *
   * @param {number} mDBID - mDBID(0~9)
   * @param {number} mDID  - MID 用のID
   * @return {Object[]} result 宛先リスト
   */
  viewReceivers(mDBID: number, mDID: number): object[] {
    const query = {
      page: `${this._pagePrefix}ReceiverAdd`,
      DBID: mDBID,
      MID: mDID,
    };

    const document = this._transport.get(query);
    const $ = cheerio.load(document);

    return $('select[name="UID"] > option')
      .map((_: any, elem: any) => {
        const parsed = $(elem);
        return {
          uID: Number(parsed.val()),
          userName: parsed.text(),
        };
      })
      .toArray()
      .filter((e: { uID: number }) => e.uID !== 0);
  }

  /**
   * 宛先を修正する
   *
   * @param {number} mDBID     - mDBID(0~9)
   * @param {number} mDID      - MID 用のID
   * @param {number} eID       - EID 用のID
   * @param {number[]} uidList - 宛先 UID リスト
   */
  modifyReceivers(mDBID: number, mDID: number, eID: number, uidList: number[]) {
    const uidPairs = uidList.map(uid => `UID=${uid}`).join('&');

    const body = {
      page: `${this._pagePrefix}ReceiverAdd`,
      DBID: mDBID,
      MID: mDID,
      EID: eID,
    };

    const encodedBody = `${Utils.buildQuery(body)}&${uidPairs}`;

    this._transport.post(encodedBody);
    return true;
  }
}
