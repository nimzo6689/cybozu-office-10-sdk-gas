export default class Consts {
  static readonly X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';
  static readonly UTF_8 = 'utf-8';
  static readonly SHIFT_JIS = 'Shift_JIS';
  static readonly DEFAULT_GROUP_NAME = 'サイボウズBot - Google Apps Script';

  public static MessageEditMode = class extends Consts {
    // テキスト。
    static readonly TEXT = 0;
    // 書式編集
    static readonly HTML = 1;
  };
}
