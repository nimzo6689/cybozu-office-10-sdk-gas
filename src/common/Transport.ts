import Consts from './Constants';
import { LoadReductionCallable, Utils } from './Helpers';

/**
 *  Cybozu Office 10 の操作を簡単にするための UrlFetchApp のラッパークラスです。
 *
 *  ＜注意＞
 *   必ず、インスタンスは１つのみ生成すること。（想定外のリクエストをしないため）
 */
export default class CybozuTransport extends LoadReductionCallable {
  _baseUrl: any;
  _session: any;

  static get CYBOZU_SESSION_KEY() {
    return 'cybozu_session';
  }

  /**
   * CybozuTransport コンストラクタ関数
   *
   * @param baseUrl      - 処理対象となるサイボウズのURL（http~/ag.cgiまで）
   * @param accountId    - ログインID
   * @param password     - パスワード
   * @param sleepSec     - スリープ間隔（秒）
   */
  constructor(baseUrl: string, accountId: string, password: string, sleepSec: number) {
    super(sleepSec);
    this._baseUrl = baseUrl;

    // 過去取得しているセッション情報
    this._session = JSON.parse(CacheService.getUserCache().get(CybozuTransport.CYBOZU_SESSION_KEY)) || {};

    if (!Object.keys(this._session).length) {
      // 初回実行時は最初にログイン処理をする。
      this._renewLoginSession(accountId, password);
    }
  }

  /**
   * GET リクエスト用のエントリポイント
   *
   * @param query - リクエストクエリ文字列
   * @return RAW コンテント文字列
   */
  get(query: string | {} = null): string {
    return this._call({
      method: 'get',
      query: query,
    }).getContentText();
  }

  /**
   * ファイルの GET リクエスト用のエントリポイント
   *
   * @param path - パス（ファイル名）
   * @param query - リクエストクエリ文字列
   * @param encoding - エンコード形式
   * @return RAW コンテント文字列
   */
  getFile(path: string, query: string, encoding: string): string {
    return this._call({
      method: 'get',
      path: path,
      query: query,
    })
      .getBlob()
      .getDataAsString(encoding)
      .trim();
  }

  /**
   * POST リクエスト用のエントリポイント
   *
   * @param body - HTTP リクエストの Body
   */
  post(body: string) {
    this._call({
      method: 'post',
      contentType: Consts.X_WWW_FORM_URLENCODED,
      body: `${body}&csrf_ticket=${this._session.csrfTicket}`,
    });
  }

  _call({ method, path = null, contentType = null, query = null, body = null }) {
    const url = `${this._baseUrl}/${path == null ? '' : path}?${Utils.buildQuery(query)}`;

    const params = {
      method: method,
      headers: {
        Cookie: this._session.cookie,
      },
      followRedirects: false,
    };
    if (contentType) {
      params['contentType'] = contentType;
    }
    if (body) {
      params['payload'] = body;
    }

    console.info({ path: url, params: params });

    this._sleepIfNeeded();
    const response = UrlFetchApp.fetch(url, params);

    this._handleErrorResponse(response.getAllHeaders());

    return response;
  }

  /**
   * @param headers - ヘッダー情報
   * @thrwos サイボウズのエラーコードをスローする
   * {@link https://jp.cybozu.help/ja/error/of10/ サイボウズ Office 10 エラーメッセージ一覧}
   */
  _handleErrorResponse(headers: object) {
    if (headers['x-cybozu-error'] !== undefined) {
      // サイボウズのエラーコードを返却
      // https://jp.cybozu.help/ja/error/of10/
      throw new Error(headers['x-cybozu-error']);
    }
  }

  /**
   * サイボウズ Office10 にアクセスするために必要な認証情報を取得する。
   * なお、取得した認証情報は CacheService.CYBOZU_SESSION_KEY へ格納する。
   *
   * @param accountId    - ログインID
   * @param password     - パスワード
   */
  _renewLoginSession(accountId: string, password: string) {
    console.info('Renewing Login Session');

    // ログインリクエストを送信。
    this._sleepIfNeeded();

    const loginResponse = UrlFetchApp.fetch(this._baseUrl, {
      method: 'post',
      payload: `_Account=${accountId}&Password=${password}&_System=login&_Login=1&LoginMethod=2`,
      contentType: Consts.X_WWW_FORM_URLENCODED,
      // UrlFetchApp::fetch では、リダイレクト先にセッション情報が連携されないため、リダイレクトは無効にする必要がある。
      followRedirects: false,
    });

    const headers = loginResponse.getAllHeaders();
    this._handleErrorResponse(headers);
    this._session.userId = headers['x-cybozu-user'];

    // サイボウズ Cookie に保存する文字列の体裁が悪いため、 AGSESSID の値以外は固定の文字列を使用する。
    this._session.cookie = Utils.createCookieValue(/AGSESSID=(.*?);/i.exec(headers['Set-Cookie'].toString())[1]);

    // csrfTicketを取得するため、TOPページにアクセスする。
    const pageCsrfTicket = this.get();
    this._session.csrfTicket = /<input type="hidden" name="csrf_ticket" value="(.*?)">/i.exec(pageCsrfTicket)[1];
    CacheService.getUserCache().put(CybozuTransport.CYBOZU_SESSION_KEY, JSON.stringify(this._session), 21600);
  }
}
