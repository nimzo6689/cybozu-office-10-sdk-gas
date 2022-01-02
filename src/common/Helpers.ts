export class LoadReductionCallable {
  _leastInterval: number;
  _lastRequestTime: number;

  constructor(leastIntervalSec: number) {
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
  static addPair(kv: any, key: any, value: any) {
    if (typeof kv == 'string') {
      return `${kv}&${key}=${value}`;
    } else {
      return { ...kv, ...{ [key]: value } };
    }
  }

  static buildQuery(params: string | {}) {
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

  static createCookieValue(agSessId: string) {
    return `CBAccount=; expires=Thu, 01-Jan-1970 00:00:00 GMT; path=/cgi-bin/cbag/; AGSESSID=${agSessId}; path=/cgi-bin/cbag/; secure; HttpOnly`;
  }
}
