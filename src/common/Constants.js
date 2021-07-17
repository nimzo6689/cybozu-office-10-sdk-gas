export default class Consts {
  static get X_WWW_FORM_URLENCODED() {
    return "application/x-www-form-urlencoded";
  }

  static get UTF_8() {
    return "utf-8";
  }

  static get SHIFT_JIS() {
    return "Shift_JIS";
  }

  static get DEFAULT_GROUP_NAME() {
    return "サイボウズBot - Google Apps Script";
  }
}

Consts.MessageEditMode = class MessageEditMode {
  // テキスト。
  static get TEXT() {
    return 0;
  }

  // 書式編集
  static get HTML() {
    return 1;
  }
};
