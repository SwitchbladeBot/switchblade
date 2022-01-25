const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class MinecraftSkin extends Command {
  constructor (client) {
    super({
      name: 'skin',
      aliases: ['minecraftskin', 'mskin', 's'],
      parent: 'minecraft',
      parameters: [{
        type: 'string',
        missingError: 'commands:minecraft.subcommands.skin.noName'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, name) {
    const findPlayer = await this.client.apis.minecraft.nameToUUID(name) || await this.client.apis.minecraft.uuidToName(name)
    if (findPlayer.uuid) {
      channel.send(
        new SwitchbladeEmbed(author)
          .setImage(`https://crafatar.com/renders/body/${findPlayer.uuid}.png?overlay=true`)
          .setDescription(t('commands:minecraft.subcommands.skin.thanks', { url: 'https://crafatar.com' }))
          .setTitle(t('commands:minecraft.namemcprofile'))
          .setURL(`https://namemc.com/profile/${findPlayer.uuid}`)
          .setAuthor(t('commands:minecraft.subcommands.skin.title', { name: findPlayer.name }), `https://crafatar.com/avatars/${findPlayer.uuid}.png?overlay=true`)
      )
    } else {
      throw new CommandError(t('commands:minecraft.subcommands.skin.unknownName'))
    }
  }
}
