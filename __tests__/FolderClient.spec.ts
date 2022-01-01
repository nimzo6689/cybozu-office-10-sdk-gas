const fs = require('fs');

import FolderClient from '../src/page/FolderClient';

describe('個人フォルダ', () => {
  const page_MyFolderIndex_rawContent = fs.readFileSync(`${__dirname}/resources/page_MyFolderIndex.rawContent`);

  it('個人フォルダ（受信箱）から取得できるか', () => {
    const CybozuTransportMock = jest.fn().mockImplementation(() => {
      return {
        get: (x = '') => {
          return page_MyFolderIndex_rawContent;
        },
      };
    });
    const client = new FolderClient(new CybozuTransportMock());

    const actual = client.inbox();
    const expected = [
      { mDBID: 2, mDID: 4, subject: 'try' },
      { mDBID: 4, mDID: 4, subject: '【講読自由】総務からのお知らせ' },
      { mDBID: 5, mDID: 4, subject: '【連絡帳】営業部 ⇔ 総務部' },
      { mDBID: 8, mDID: 4, subject: '健康診断のお知らせ' },
      {
        mDBID: 9,
        mDID: 4,
        subject: 'スマートフォンから「サイボウズ　Office」を利用したい方...',
      },
      { mDBID: null, mDID: 4, subject: '【回覧板】『電話メモ』の利用について' },
      {
        mDBID: null,
        mDID: 25,
        subject: '個人フォルダの 「＋」 ボタンについて',
      },
      { mDBID: null, mDID: 33, subject: '【連絡帳】営業部 ⇔ 総務部' },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
