const CommandStructures = require('./structures/command')
const GameStructures = require('./structures/game')

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
  SubcommandListCommand: CommandStructures.SubcommandListCommand,

  // Game Structures
  GameStructures,
  Game: GameStructures.Game,
  TwoPlayerGame: GameStructures.TwoPlayerGame,
  Matrix: GameStructures.Matrix,
  Player: GameStructures.Player,
  PlayerManager: GameStructures.PlayerManager,

  // Structures
  APIWrapper: require('./structures/APIWrapper.js'),
  Connection: require('./structures/Connection.js'),
  EventListener: require('./structures/EventListener.js'),
  Loader: require('./structures/Loader.js'),
  Controller: require('./structures/Controller.js'),
  Module: require('./structures/Module.js'),
  Route: require('./structures/Route.js'),
  SwitchbladeEmbed: require('./structures/SwitchbladeEmbed.js'),
  Webhook: require('./structures/Webhook.js'),
  PaginatedEmbed: require('./structures/PaginatedEmbed.js'),

  // Utils
  Utils: require('./utils'),
  Color: require('./utils/Color.js'),
  Constants: require('./utils/Constants.js'),
  DiscordUtils: require('./utils/DiscordUtils.js'),
  FileUtils: require('./utils/FileUtils.js'),
  MiscUtils: require('./utils/MiscUtils.js'),
  CanvasTemplates: require('./utils/CanvasTemplates.js'),
  PermissionUtils: require('./utils/PermissionUtils.js'),
  EmojiUtils: require('./utils/EmojiUtils.js'),
  EndpointUtils: require('./utils/EndpointUtils.js'),
  GitUtils: require('./utils/GitUtils.js'),
  ConfirmationBox: require('./utils/ConfirmationBox.js'),
  PlaceholderUtils: require('./utils/placeholders/PlaceholderUtils.js'),
  PlaceholderRules: require('./utils/placeholders/PlaceholderRules.js')
}
