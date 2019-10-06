const { Module } = require('../')

module.exports = class LanguageModule extends Module {
  constructor (client) {
    super(client, {
      name: 'language',
      displayName: 'Language',
      toggleable: false,
      fields: [{
        key: 'language',
        displayName: 'Guild\'s language',
        type: 'stringDropdown',
        defaultValue: 'en-US',
        values: Object.keys(client.i18next.store.data)
      }]
    })
  }

  get defaultState () {
    return {
      ...super.defaultState,
      enabled: true
    }
  }
}
