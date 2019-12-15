const { Command, SwitchbladeEmbed, CommandError } = require('../../../')
const Fuse = require('fuse.js')

module.exports = class LegendsOfRuneterraCard extends Command {
  constructor (client) {
    super({
      name: 'card',
      aliases: ['c'],
      parent: 'legendsofruneterra',
      requirements: { apis: ['legendsofruneterra'] },
      parameters: [{
        type: 'string', full: true, missingError: 'commands:legendsofruneterra.subcommands.card.missingCard'
      }, [{
        type: 'booleanFlag', name: 'base'
      }]]
    }, client)
  }

  async run ({ t, author, channel, language, flags }, query) {
    const data = await this.client.apis.legendsofruneterra.getCardData(language)
    const globals = await this.client.apis.legendsofruneterra.getCoreData(language)
    const fuse = new Fuse(data, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'name',
        'cardCode'
      ]
    })

    let card = fuse.search(query)[0]

    if (!card) throw new CommandError(t('commands:legendsofruneterra.subcommands.card.noCardsFound'), false)

    if (query.toUpperCase() !== card.cardCode) card = this.levelUp(card, data)
    if (flags.base) card = this.getBase(card, data)

    channel.send(
      new SwitchbladeEmbed(author)
        .setTitle(card.name)
        .setURL(`https://lor.mobalytics.gg/cards/${card.cardCode}`)
        .setDescriptionFromBlockArray([
          [
            this.parseDescription(card, data, globals)
          ],
          [
            `${this.getEmoji(`lorregion${card.regionRef.toLowerCase()}`, '')} **${card.region}**`
          ],
          card.keywordRefs.map((k, i) => {
            return `${this.getEmoji(`lorsprite${k.toLowerCase()}`, '')}** ${card.keywords[i]}** ${globals.keywords.find(kw => kw.nameRef === k).description}`
          }),
          [
            `> _${card.flavorText.replace(/^\n+|\n+$/g, '')}_`
          ],
          [
            card.associatedCardRefs.length > 0 ? `**${t('commands:legendsofruneterra.subcommands.card.associatedCards')}:** ${card.associatedCardRefs.map(c => `[${this.getCardName(c, data, t)}](https://lor.mobalytics.gg/cards/${c})`).join(', ')}` : null
          ]
        ])
        .setImage(this.client.apis.legendsofruneterra.getCardImageURL(card.cardCode, language))
        .setThumbnail(card.type !== 'Spell' ? this.client.apis.legendsofruneterra.getFullCardImageURL(card.cardCode, language) : null)
        .setFooter(`${card.cardCode} • ${t('commands:legendsofruneterra.subcommands.card.illustrationBy', { artistName: card.artistName })}`)
    )
  }

  parseDescription (card, data, globals) {
    let description = card.description

    // Replace Sprites with Discord Emojis
    description = description.replace(/<sprite name=([a-zA-Z]*)>/g, (match, spriteName) => {
      return this.getEmoji(`lorsprite${spriteName.toLowerCase()}`, '')
    })

    // Apply styles
    description = description.replace(/<style=([a-zA-z]*)>((?:.(?!<style))*?)<\/style>/g, (match, style, text) => {
      if (style === 'Vocab') return `*${text}*`
      if (style === 'VocabNoTooltip') return `*${text}*`
      if (style === 'AssociatedCard') return `__${text}__`
      if (style === 'Keyword') return `**${text}**`
      return text
    })

    // Create links
    description = description.replace(/<link=([a-z]*)\.([a-zA-z0-9 ]*)*>((?:.(?!<link))+?)<\/link>/g, (match, type, link, text) => {
      // Keyword Links
      if (type === 'keyword') {
        const keyword = globals.keywords.find(k => k.nameRef === link)
        return `[${text}](http://google.com "${keyword.description}")`
      }

      // Card links
      // TODO: Add vocab and other card link types
      if (type === 'card' && link === 'level1') {
        const baseCard = this.getBase(card, data)
        return `[${text}](https://lor.mobalytics.gg/cards/${baseCard.cardCode})`
      }

      return text
    })

    return description
  }

  getCardName (cardCode, data, t) {
    return data.find(c => c.cardCode === cardCode).name
  }

  levelUp (card, data) {
    return data.find(c => !c.collectible && c.supertype === 'Champion' && c.cardCode.startsWith(card.cardCode)) || card
  }

  getBase (card, data) {
    return data.find(c => c.cardCode === card.cardCode.substring(0, 7))
  }
}
