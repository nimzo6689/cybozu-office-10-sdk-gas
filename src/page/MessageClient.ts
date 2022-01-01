const cheerio = require('cheerio');

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
  constructor(transport) {
    this._pagePrefix = 'MyFolderMessage';
    this._transport = transport;
  }

  /**
   * メッセージの送信
   *
   * @param {String} subject              - 標題
   * @param {String} data                 - コメント文
   * @param {Array}  uidList              - 宛先 UID リスト
   * @param {String} group                - コメントする際に表示されるグループ名
   * @param {String} editableByReceivers  - 宛先のユーザーにメッセージの変更を許可する（0: 無許可, 1: 許可）
   * @param {String} useConfirm           - 閲覧状況を確認する（0: 無効, 1: 有効）
   * @param {String} simpleReplyEnable    - リアクションを許可する（0: 無許可, 1: 許可）
   */
  send(
    subject,
    data,
    uidList,
    group = Consts.DEFAULT_GROUP_NAME,
    editableByReceivers = 1,
    useConfirm = 0,
    simpleReplyEnable = 1
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
  view(mDBID, mDID) {
    throw new Error('Not supported yet.');
  }

  /**
   * メッセージの移動
   *
   * @param {number} mDBID                - mDBID(0~9)
   * @param {number} mDID                 - MID 用の ID
   * @param {number} pID                  - PID 用の ID
   */
  move(mDBID, mDID, pID) {
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
  viewFollows(mDBID, mDID, hID = null) {
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
      .map((i, el) => {
        const parsed = $(el);

        const attached = parsed.find('.vr_viewContentsAttach td:first-child a').attr('href');
        let _, attachedFile, attachedQuery;
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
   * @param {String} subject              - 標題
   * @param {String} data                 - コメント文
   * @param {String} group                - コメントする際に表示されるグループ名
   * @param {String} editableByReceivers  - 宛先のユーザーにメッセージの変更を許可する（0: 無許可, 1: 許可）
   * @param {String} useConfirm           - 閲覧状況を確認する（0: 無効, 1: 有効）
   * @param {String} simpleReplyEnable    - リアクションを許可する（0: 無許可, 1: 許可）
   */
  modify(
    mDBID,
    mDID,
    subject,
    data,
    group = Consts.DEFAULT_GROUP_NAME,
    editableByReceivers = 1,
    useConfirm = 0,
    simpleReplyEnable = 1
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
  delete(mDBID, mDID) {
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
  addFollow(mDBID, mDID, data, group = Consts.DEFAULT_GROUP_NAME) {
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
  deleteFollow(mDBID, mDID, followId) {
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
   * @param {string} cancel    - キャンセルフラグ（0: 正常、 1: キャンセル）
   * @param {string} mark      - マーク（'good', 'ok', 'smile', 'sad'）
   */
  replySimple(mDBID, mDID, followId, cancel = 0, mark = null) {
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
   * @return {number} result.uID - UID
   * @return {string} result.userName - ユーザ名
   */
  viewReceivers(mDBID, mDID) {
    const query = {
      page: `${this._pagePrefix}ReceiverAdd`,
      DBID: mDBID,
      MID: mDID,
    };

    const document = this._transport.get(query);
    const $ = cheerio.load(document);

    return $('select[name="UID"] > option')
      .map((i, elem) => {
        const parsed = $(elem);
        return {
          uID: Number(parsed.val()),
          userName: parsed.text(),
        };
      })
      .toArray()
      .filter(e => e.uID !== 0);
  }

  /**
   * 宛先を修正する
   *
   * @param {number} mDBID     - mDBID(0~9)
   * @param {number} mDID      - MID 用のID
   * @param {number} eID       - EID 用のID
   * @param {number[]} uidList - 宛先 UID リスト
   */
  modifyReceivers(mDBID, mDID, eID, uidList) {
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
