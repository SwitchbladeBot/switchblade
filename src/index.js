const CommandStructures = require('./structures/command')

module.exports = {
  // Command Structures
  CommandStructures,
  Command: CommandStructures.Command,
  CommandContext: CommandStructures.CommandContext,
  CommandError: CommandStructures.CommandError,
  CommandParameters: CommandStructures.CommandParameters,
  CommandRequirements: CommandStructures.CommandRequirements,

  // Structures
  APIWrapper: require('./structures/APIWrapper.js'),
  EventListener: require('./structures/EventListener.js'),
  Module: require('./structures/Module.js'),
  SwitchbladeEmbed: require('./structures/SwitchbladeEmbed.js'),

  // Utils
  Reddit: require('./utils/Reddit.js'),
  Constants: require('./utils/Constants.js'),
  DiscordUtils: require('./utils/DiscordUtils.js'),
  MiscUtils: require('./utils/MiscUtils.js'),
  CanvasTemplates: require('./utils/CanvasTemplates.js'),
  PermissionUtils: require('./utils/PermissionUtils.js'),
  BlacklistUtils: require('./utils/BlacklistUtils.js'),
  EmojiUtils: require('./utils/EmojiUtils.js'),

  // Etc
  Switchblade: require('./Switchblade.js')
}
