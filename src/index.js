const CommandStructures = require('./structures/command')

module.exports = {
  // Command Structures
  CommandStructures,
  Command: CommandStructures.Command,
  CommandContext: CommandStructures.CommandContext,
  CommandError: CommandStructures.CommandError,
  CommandParameters: CommandStructures.CommandParameters,
  CommandRequirements: CommandStructures.CommandRequirements,
  Parameter: CommandStructures.Parameter,

  // Command extensions
  RandomRedditPostCommand: CommandStructures.RandomRedditPostCommand,
  SearchCommand: CommandStructures.SearchCommand,

  // Structures
  APIWrapper: require('./structures/APIWrapper.js'),
  Connection: require('./structures/Connection.js'),
  EventListener: require('./structures/EventListener.js'),
  Loader: require('./structures/Loader.js'),
  Module: require('./structures/Module.js'),
  Route: require('./structures/Route.js'),
  SwitchbladeEmbed: require('./structures/SwitchbladeEmbed.js'),
  Webhook: require('./structures/Webhook.js'),

  // Utils
  Reddit: require('./utils/Reddit.js'),
  Constants: require('./utils/Constants.js'),
  DiscordUtils: require('./utils/DiscordUtils.js'),
  FileUtils: require('./utils/FileUtils.js'),
  MiscUtils: require('./utils/MiscUtils.js'),
  CanvasTemplates: require('./utils/CanvasTemplates.js'),
  PermissionUtils: require('./utils/PermissionUtils.js'),
  EmojiUtils: require('./utils/EmojiUtils.js'),
  EndpointUtils: require('./utils/EndpointUtils.js')
}
