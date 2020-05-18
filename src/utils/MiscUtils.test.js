const MiscUtils = require('./MiscUtils.js')

test('findArrayDuplicates', () => {
  expect(MiscUtils.findArrayDuplicates([1, 1, 2])).toStrictEqual([1])
  expect(MiscUtils.findArrayDuplicates(["banana", "banana", "apple"])).toStrictEqual(["banana"])
})

test('capitalizeFirstLetter', () => {
  expect(MiscUtils.capitalizeFirstLetter('helloItsMe')).toBe('HelloItsMe')
  expect(MiscUtils.capitalizeFirstLetter('hello world', true)).toBe('Hello World')
})
