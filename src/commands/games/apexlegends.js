const { Command, CommandError, Constants, SwitchbladeEmbed } = require('../..')

const platforms = { xbox: '1', psn: '2', origin: '5', pc: '5' }

module.exports = class ApexLegendsPlayer extends Command {
  constructor (client) {
    super(client, {
      name: 'apexlegends',
      category: 'games',
      aliases: ['apex', 'apexl'],
      parameters: [{
        type: 'string',
        whitelist: platforms,
        missingError: 'commands:apexlegends.noPlatform'
      }, {
        type: 'string',
        missingError: 'commands:apexlegends.noPlayer'
      }, [{
        type: 'booleanFlag', name: 'legends', aliases: ['legend']
      }]],
      embedColor: Constants.APEX_LEGENDS_COLOR
    })
  }

  async run ({ t, channel, author, language, flags }, platform, player) {
    channel.startTyping()
    // TODO: Return lifetime stats of the user + available legends when no flgas.
    // TODO: Return lifetime stats of the user + legend infos - each in separate embed.
    // Multiple legend infos: hand it off to a function, to display all of the legends in separate embed.
    // text = text.replace(/\s/g, '/')
    platform = platforms[platform]
    const response = await this.client.apis.apexlegends.getPlayer(platform, player)

    if (response.errors) {
      // TODO: Write the account not found string
      throw new CommandError(t(response.errors[0].message))
    } else {
      let description = '**Legends**\n\n'
      const embed = new SwitchbladeEmbed()
        .setAuthor(response.data.metadata.platformUserHandle)
        .addField(this.getMetadataName(response.data.stats[0]), this.getDisplayValue(response.data.stats[0]), true)
        .addField(this.getMetadataName(response.data.stats[1]), this.getDisplayValue(response.data.stats[1]), true)
        .addField(this.getMetadataName(response.data.stats[2]), this.getDisplayValue(response.data.stats[2]), true)
        .addField(`Rank`, `#${this.getDisplayRank(response.data.stats[0])}`, true)
        .addField(`Rank`, `#${this.getDisplayRank(response.data.stats[1])}`, true)
        .addField(`Rank`, `#${this.getDisplayRank(response.data.stats[2])}`, true)
      for (var i = 0; i < response.data.children.length; i++) {
        const line = `\`${i + 1}\`. ${response.data.children[i].metadata.legend_name}\n`
        description = description.concat(line)
      }
      embed.setDescription(description)
      channel.send(embed)

      console.log(response.data.children.length)
      if (flags['legends']) {
        console.log(`reached flag checking`)
        for (let i = 0; i < response.data.children.length; i++) {
          console.log(i)
          const legendEmbed = new SwitchbladeEmbed()
            .setAuthor(response.data.metadata.platformUserHandle)
            .setTitle(response.data.children[i].metadata.legend_name)
            .addField(this.getMetadataName(response.data.children[i].stats[0]), this.getDisplayValue(response.data.children[i].stats[0]), true)
            .addField(this.getMetadataName(response.data.children[i].stats[1]), this.getDisplayValue(response.data.children[i].stats[1]), true)
            .addField(this.getMetadataName(response.data.children[i].stats[2]), this.getDisplayValue(response.data.children[i].stats[2]), true)
            .addField(`Rank`, `#${this.getRank(response.data.children[i].stats[0])}`, true)
            .addField(`Rank`, `#${this.getRank(response.data.children[i].stats[1])}`, true)
            .addField(`Rank`, `#${this.getRank(response.data.children[i].stats[2])}`, true)
          await channel.send(legendEmbed)
        }
      }
      channel.stopTyping()
    }
  }

  getMetadataName (data) {
    if (!data) {
      return `No data`
    } else {
      return data.metadata.name
    }
  }

  getDisplayValue (data) {
    if (!data) {
      return `No data`
    } else {
      return data.displayValue
    }
  }

  getRank (data) {
    if (!data) {
      return `No data`
    } else {
      return data.rank
    }
  }

  getDisplayRank (data) {
    if (!data) {
      return `No data`
    } else {
      return data.displayRank
    }
  }
}
