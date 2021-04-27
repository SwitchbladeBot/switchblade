const { SearchCommand, SwitchbladeEmbed, MiscUtils } = require('../../')

const RUBYGEMS_COLOR = '#fb5e2b'
const RUBYGEMS_ICON = 'https://avatars1.githubusercontent.com/u/208761'

module.exports = class RubyGems extends SearchCommand {
  constructor (client) {
    super({
      name: 'rubygems',
      aliases: ['gem', 'rubygem'],
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:rubygems.noNameProvided'
      }],
      embedColor: RUBYGEMS_COLOR,
      embedLogoURL: RUBYGEMS_ICON
    }, client)
  }

  async search (context, query) {
    return this.client.apis.rubygems.search(query)
  }

  searchResultFormatter (gem) {
    return `[${gem.name}](${gem.project_uri}) \`${gem.version}\``
  }

  async handleResult ({ t, channel, author, language }, partialGem) {
    channel.startTyping()
    const gem = await this.client.apis.rubygems.getGem(partialGem.name)
    channel.send(
      new SwitchbladeEmbed(author)
        .setAuthor('RubyGems.org', RUBYGEMS_ICON)
        .setColor(RUBYGEMS_COLOR)
        .setDescriptionFromBlockArray([
          [
            `[**${gem.name}**](${gem.project_uri}) _${gem.version}_`,
            gem.info
          ],
          [
            `_${t('commands:rubygems.downloadCount', { count: MiscUtils.formatNumber(gem.downloads, language) })}_`
          ],
          [
            [
              'gem',
              'homepage',
              'wiki',
              'documentation',
              'mailing_list',
              'source_code',
              'bug_tracker',
              'changelog'
            ].filter(u => !!gem[`${u}_uri`]).map(u => `[${t(`commands:rubygems.uris.${u}`)}](${gem[`${u}_uri`]})`).join(' • ')
          ],
          [
            '**Gemfile**',
            `\`\`\`gem '${gem.name}', '~> ${gem.version}'\`\`\``,
            `**${t('commands:rubygems.install')}**`,
            `\`\`\`gem install ${gem.name}\`\`\``
          ]
        ])
    ).then(() => { channel.stopTyping() })
  }
}
