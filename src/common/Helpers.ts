export class LoadReductionCallable {
  _leastInterval: any;
  _lastRequestTime: any;
  /**
   * CybozuOffice コンストラクタ関数
   *
   * @constructor
   * @param {number} leastIntervalSec  - スリープ時間
   */
  constructor(leastIntervalSec) {
    this._leastInterval = leastIntervalSec * 1000;
    this._lastRequestTime = new Date().getTime() - this._leastInterval;
  }

  _sleepIfNeeded() {
    const interval = new Date().getTime() - this._lastRequestTime;
    if (interval < this._leastInterval) {
      Utilities.sleep(this._leastInterval - interval);
    }
  }
}

export class Utils {
  static addPair(kv, key, value) {
    if (typeof kv == 'string') {
      return `${kv}&${key}=${value}`;
    } else {
      return { ...kv, ...{ [key]: value } };
    }
  }

  static buildQuery(params) {
    if (!params) {
      return '';
    }

    if (typeof params == 'string') {
      return params;
    }

    return Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent('' + value)}`)
      .join('&');
  }

  static createCookieValue(agSessId) {
    return `CBAccount=; expires=Thu, 01-Jan-1970 00:00:00 GMT; path=/cgi-bin/cbag/; AGSESSID=${agSessId}; path=/cgi-bin/cbag/; secure; HttpOnly`;
  }
}
