const { Module } = require('../')

module.exports = class DidYouMeanModule extends Module {
  constructor (client) {
    super({
      name: 'didYouMean',
      displayName: 'Did You Mean',
      defaultState: false
    }, client)
  }
}
