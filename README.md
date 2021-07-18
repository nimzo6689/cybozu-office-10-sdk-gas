# サイボウズ Office 10 を操作するための Google Apps Script 用の SDK

以下のプロジェクトに依存性があります。

- Google Apps Script 用の webpack プラグイン [gas-webpack-plugin](https://github.com/fossamagna/gas-webpack-plugin)
- HTML パーサー [cheerio](https://github.com/cheeriojs/cheerio)

Script ID: `1lL-Cy5zFVjxDNzwtjuKxi22VtSNU6bSOodSrxSHeqkKCwJa2E8QrirL0`

## 使い方

```js
const loginId = "xxxxxxx";
const password = "xxxxxxx";

const cybozuOffice = new SUT.CybozuOffice(
  "https://test.cybozu.info/scripts/office10/ag.cgi",
  loginId,
  password
);
```

### 「ユーザー名簿」のグループメンバーの取得

```js
const GID = 1111;
const members = cybozuOffice.user.index(GID);

members.forEach((m) => `ユーザーID: ${m.uID}, ユーザ名: ${m.userName}`);
```
