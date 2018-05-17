const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it

describe('Code quality', function () {
  it('conforms to standard', require('mocha-standard'))
})
