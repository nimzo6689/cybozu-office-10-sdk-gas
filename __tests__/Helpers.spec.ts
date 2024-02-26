import { Utils } from '../src/common/Helpers';

describe('ヘルパー関数', () => {
  it('クッキー文字列から AGSESSID の値を取得できるか', () => {
    expect(Utils.createCookieValue('xxx')).toBe(
      'CBAccount=; expires=Thu, 01-Jan-1970 00:00:00 GMT; path=/cgi-bin/cbag/; AGSESSID=xxx; path=/cgi-bin/cbag/; secure; HttpOnly'
    );
  });
});
