# サイボウズ Office 10 を操作するための Google Apps Script 用の SDK

以下のプロジェクトに依存性があります。

- Google Apps Script 用の webpack プラグイン [gas-webpack-plugin](https://github.com/fossamagna/gas-webpack-plugin)
- HTML パーサー [cheerio](https://github.com/cheeriojs/cheerio)

Script ID: `1lL-Cy5zFVjxDNzwtjuKxi22VtSNU6bSOodSrxSHeqkKCwJa2E8QrirL0`

## 使い方

以下、 Google Apps Script エディタ内でライブラリの参照名を `CybozuOfficeSDK` とした場合を想定しています。

```js
const loginId = 'xxxxxxx';
const password = 'xxxxxxx';

const cybozuOffice = new CybozuOfficeSDK.CybozuOffice(
  'https://test.cybozu.info/scripts/office10/ag.cgi',
  loginId,
  password
);
```

### 「ユーザー名簿」のグループメンバーの取得

```js
const GID = 1111;
const members = cybozuOffice.user.index(GID);

members.forEach(m => `ユーザーID: ${m.uID}, ユーザ名: ${m.userName}`);
```

## サポート機能一覧

:heavy_check_mark: ・・・ サポート済み  
:x: ・・・ 未サポート  
\- 　・・・ 存在しない機能

| 機能                                                | 作成               | 詳細               | 編集               | 削除               | 一覧               | 検索 | フォルダの移動     | ファイルのダウンロード |
| --------------------------------------------------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ | ---- | ------------------ | ---------------------- |
| 個人フォルダ > フォルダ                             | :x:                | :x:                | :x:                | :x:                | :heavy_check_mark: | :x:  | :x:                | -                      |
| 個人フォルダ > メッセージ                           | :heavy_check_mark: | :x:                | :heavy_check_mark: | :heavy_check_mark: | -                  | :x:  | :heavy_check_mark: | -                      |
| 個人フォルダ > メッセージ > リアクション            | :x:                | -                  | -                  | :x:                | -                  | -    | -                  | -                      |
| 個人フォルダ > メッセージ > 宛先                    | -                  | :heavy_check_mark: | :heavy_check_mark: | -                  | -                  | -    | -                  | -                      |
| 個人フォルダ > メッセージ > 更新通知                | -                  | :x:                | :x:                | -                  | -                  | -    | -                  | -                      |
| 個人フォルダ > メッセージ > コメント                | :heavy_check_mark: | :heavy_check_mark: | -                  | :heavy_check_mark: | :x:                | -    | -                  | -                      |
| 個人フォルダ > メッセージ > コメント > リアクション | :heavy_check_mark: | -                  | -                  | :heavy_check_mark: | -                  | -    | -                  | -                      |
| 掲示板 > 掲示                                       | :x:                | :x:                | :x:                | :x:                | :x:                | :x:  | :x:                | -                      |
| 掲示板 > 掲示 > リアクション                        | :x:                | :x:                | -                  | :x:                | -                  | -    | -                  | -                      |
| 掲示板 > 掲示 > 更新通知                            | -                  | :x:                | :x:                | -                  | -                  | -    | -                  | -                      |
| 掲示板 > 掲示 > コメント                            | :heavy_check_mark: | :x:                | -                  | :x:                | :x:                | -    | -                  | -                      |
| 掲示板 > 掲示 > コメント > リアクション             | -                  | -                  | -                  | -                  | -                  | -    | -                  | -                      |
| ファイル管理 > フォルダ                             | :x:                | :x:                | :x:                | :x:                | :x:                | :x:  | :x:                | -                      |
| ファイル管理 > フォルダ > 更新通知                  | -                  | :x:                | :x:                | -                  | -                  | -    | -                  | -                      |
| ファイル管理 > ファイル                             | :x:                | :x:                | :x:                | :x:                | :x:                | :x:  | :x:                | :heavy_check_mark:     |
| ユーザ名簿 > ユーザー情報                           | -                  | :x:                | :x:                | -                  | :heavy_check_mark: | -    | -                  | -                      |
| スケジュール > 予定                                 | :x:                | :x:                | :x:                | :x:                | :x:                | :x:  | -                  | -                      |

## その他

[API ドキュメント](https://github.com/nimzo6689/cybozu-office-10-sdk-gas/blob/main/docs/api.md)
