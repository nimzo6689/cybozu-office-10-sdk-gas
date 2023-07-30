[![CI Status](https://github.com/nimzo6689/cybozu-office-10-sdk-gas/workflows/CI/badge.svg)](https://github.com/nimzo6689/cybozu-office-10-sdk-gas/actions?workflow=CI)
[![Coverage Status](https://coveralls.io/repos/github/nimzo6689/cybozu-office-10-sdk-gas/badge.svg?branch=main)](https://coveralls.io/github/nimzo6689/cybozu-office-10-sdk-gas?branch=main)

# Cybozu Office 10 SDK for Google Apps Script

## 概要

Google Apps Script で動作するサイボウズ Office 10 用の SDK です。

## 使い方

以下の Script ID で公開しています。

Script ID: `1ZEsZAlIF_N11hZTD13DVpTgY_zNnqwTJOE0aVqPK7Xy-ZvLu91XVwNbT`

以下 Google Apps Script エディタ内でライブラリの参照名を `CybozuOfficeSDK` とした場合の実装例です。

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

## ローカル環境で使用する方法

ローカル環境で開発している GAS プロジェクトでこちらの SDK を利用したい場合、  
以下の手順で対応できます。  

※ 上の Script ID は使わず、ご自身でこのプロジェクトをビルドして  
Google Apps Scripts で公開したい場合も同じ要領で対応可能です。  

```bash
git clone https://github.com/nimzo6689/cybozu-office-10-sdk-gas.git
cd cybozu-office-10-sdk-gas

npm install
npm build

cd ..
mkdir cybozu-office-10-sdk-gas-deploy
cd cybozu-office-10-sdk-gas-deploy

cat << 'EOF' > package.json
{
  "name": "cybozu-office-10-sdk-gas-deploy",
  "version": "1.0.0",
  "description": "",
  "mode": "none",
  "scripts": {
    "build": "webpack"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "gas-webpack-plugin": "^2.2.1",
    "ts-loader": "^9.3.0",
    "typescript": "^4.7.2",
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2",
    "@google/clasp": "^2.4.2" 
  },
  "private": true,
  "dependencies": {
    "@types/google-apps-script": "^1.0.47",
    "cybozu-office-10-sdk-gas": "^1.0.0"
  }
}
EOF

cat << 'EOF' > webpack.config.js
const GasPlugin = require('gas-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: `./src/index.ts`,
  output: {
    path: `${__dirname}/dist`,
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new GasPlugin()],
};
EOF

cat << 'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "declaration": false,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["__tests__/**/*.spec.ts"]
}
EOF

mkdir -p src

# CybozuOffice を global に初期化してますが、
# GAS の IDE 上で CybozuOffice を直接参照しない場合、この文は不要です。
cat << 'EOF' > src/index.ts
import { CybozuOffice } from 'cybozu-office-10-sdk-gas';

(global as any).CybozuOffice = CybozuOffice;
EOF

## https://script.new にアクセスして新規の Google Apps Script プロジェクトを作成し、
## URL から scriptId を取り出し、以下で生成する .clasp.json に記載する。 
## プロジェクトの名前も付けておくと後で確認しやすい。

cat << EOF > .clasp.json
{
  "scriptId": "",
  "rootDir": "dist",
  "fileExtension": "js"
}
EOF

mkdir -p dist

cat << 'EOF' > dist/appsscript.json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
EOF

npm install
npm link ../cybozu-office-10-sdk-gas
npm run build

npx clasp login

npx clasp push
```

## サポート機能一覧

SDK でサポートできている機能の一覧です。  
※ 正直、 x を今後対応させる予定はありません。  

o ・・・ サポート済み  
x ・・・ 未サポート  
\- 　・・・ 存在しない機能  
  
| 機能 | 作成 | 詳細 | 編集 | 削除 | 一覧 | 検索 | フォルダの移動 | ファイルのダウンロード |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 個人フォルダ > フォルダ | x | x | x | x | o | x  | x | - |
| 個人フォルダ > メッセージ | o | x | o | o | - | x  | o | - |
| 個人フォルダ > メッセージ > リアクション | x | - | - | x | - | - | - | - |
| 個人フォルダ > メッセージ > 宛先 | - | o | o | - | - | - | - | - |
| 個人フォルダ > メッセージ > 更新通知 | - | x | x | - | - | - | - | - |
| 個人フォルダ > メッセージ > コメント | o | o | - | o | x | - | - | - |
| 個人フォルダ > メッセージ > コメント > リアクション | o | - | - | o | - | - | - | - |
| 掲示板 > 掲示 | x | x | x | x | x | x | x | - |
| 掲示板 > 掲示 > リアクション | x | x | - | x | - | - | - | - |
| 掲示板 > 掲示 > 更新通知 | - | x | x | - | - | - | - | - |
| 掲示板 > 掲示 > コメント | o | x | - | x | x | - | - | - |
| 掲示板 > 掲示 > コメント > リアクション | - | - | - | - | - | - | - | - |
| ファイル管理 > フォルダ | x | x | x | x | x | x | x | - |
| ファイル管理 > フォルダ > 更新通知 | - | x | x | - | - | - | - | - |
| ファイル管理 > ファイル | x | x | x | x | x | x | x | o |
| ユーザ名簿 > ユーザー情報 | - | x | x | - | o | - | - | - |
| スケジュール > 予定 | x | x | x | x | x | x | - | - |

## その他

[API ドキュメント](https://nimzo6689.github.io/cybozu-office-10-sdk-gas/)
