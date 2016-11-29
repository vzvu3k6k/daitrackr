let assert = require('assert')
let util = require('../lib/util')

describe('extractAntennaId', () => {
  let validTestCases = {
    'a series of integer': '123456789012345678',
    'an antenna permalink': 'https://daichkr.hatelabo.jp/antenna/123456789012345678',
    'a collection permalink': 'https://daichkr.hatelabo.jp/collection/123456789012345678',
    'a permalink without scheme': 'daichkr.hatelabo.jp/antenna/123456789012345678',
    'a permalink with trailing spaces': '   https://daichkr.hatelabo.jp/collection/123456789012345678'
  }
  for (let [type, arg] of Object.entries(validTestCases)) {
    it(`should return an antenna ID when the argument is ${type}`, () => {
      assert.strictEqual(util.extractAntennaId(arg), '123456789012345678')
    })
  }

  it('should return null when the argument is invalid', () => {
    let testCases = [
      '',
      'foo'
    ]
    for (let arg of testCases) {
      assert.strictEqual(util.extractAntennaId(arg), null)
    }
  })
})
