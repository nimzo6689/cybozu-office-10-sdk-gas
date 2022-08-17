const fs = require('fs');

import MessageClient from '../src/page/MessageClient';

describe('メッセージ', () => {
  const page_MyFolderIndex_rawContent = fs.readFileSync(`${__dirname}/resources/page_MyFolderMessageView.rawContent`);

  it('メッセージの送信', () => {
    const CybozuTransportMock = jest.fn().mockImplementation(() => {
      return {
        post: (x = '') => {},
      };
    });
    const client = new MessageClient(new CybozuTransportMock());

    client.send('タイトル', '本文', [1], 'グループ', 1, 0, 1);
  });

  it('メッセージのコメントが取得できるか', () => {
    const CybozuTransportMock = jest.fn().mockImplementation(() => {
      return {
        get: (x = '') => {
          return page_MyFolderIndex_rawContent;
        },
      };
    });
    const client = new MessageClient(new CybozuTransportMock());

    const actual = client.viewFollows(4, 4);
    const expected = [
      {
        followId: 24,
        userName: '和田 一夫',
        attachedFile: undefined,
        attachedQuery: undefined,
      },
      {
        followId: 21,
        userName: '大山 春香',
        attachedFile:
          '%E8%A9%A6%E9%A8%93%E7%94%A8%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB(%E5%A4%A7%E5%B1%B1%E6%98%A5%E9%A6%99).txt',
        attachedQuery:
          'page=FileDownload&id=1712074&mDBID=7&mEID=85&mDID=313440&notimecard=1&type=text&subtype=plain&ct=1&ext=.txt',
      },
      {
        followId: 17,
        userName: '加藤 美咲',
        attachedFile: undefined,
        attachedQuery: undefined,
      },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });

  it('宛先リストを取得する', () => {
    const CybozuTransportMock = jest.fn().mockImplementation(() => {
      return {
        get: (x = '') => {
          return page_MyFolderIndex_rawContent;
        },
      };
    });
    const client = new MessageClient(new CybozuTransportMock());

    const actual = client.viewReceivers(4, 4);
    const expected = [];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
