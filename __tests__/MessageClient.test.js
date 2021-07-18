const fs = require('fs');

import MessageClient from '../src/page/MessageClient';

describe('メッセージ', () => {
  const page_MyFolderIndex_rawContent = fs.readFileSync(`${__dirname}/resources/page_MyFolderMessageView.rawContent`);

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
        followId: 17,
        userName: '加藤 美咲',
        attachedFile: undefined,
        attachedQuery: undefined,
      },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
