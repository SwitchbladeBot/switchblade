const commandLocales = require('../locales/en-US/commands.json')

test('every command in commands.json has a description', () => {
  Object.keys(commandLocales).forEach(command => {
    expect(commandLocales[command]).toHaveProperty('commandDescription')
  })
})