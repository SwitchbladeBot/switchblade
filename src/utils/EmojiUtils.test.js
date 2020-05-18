const EmojiUtils = require('./EmojiUtils.js')
const Constants = require('./Constants.js')

test('getFlag', () => {
  expect(EmojiUtils.getFlag('br')).toBe(':flag_br:')
  expect(EmojiUtils.getFlag('BR')).toBe(':flag_br:')
  expect(EmojiUtils.getFlag('us')).toBe(':flag_us:')
  expect(EmojiUtils.getFlag()).toBe(Constants.UNKNOWN_COUNTRY_FLAG)
})
