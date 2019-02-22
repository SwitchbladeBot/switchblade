module.exports = {
  // Structures
  Command: require('./Command.js'),
  CommandContext: require('./CommandContext.js'),
  CommandError: require('./CommandError.js'),
  CommandParameters: require('./parameters/CommandParameters.js'),
  CommandRequirements: require('./CommandRequirements.js'),

  // Command extensions
  RandomRedditPostCommand: require('./RandomRedditPostCommand.js'),
  SearchCommand: require('./SearchCommand.js'),

  // Parameters
  Parameter: require('./parameters/types/Parameter.js'),
  BooleanFlagParameter: require('./parameters/types/BooleanFlagParameter.js'),
  BooleanParameter: require('./parameters/types/BooleanParameter.js'),
  ColorParameter: require('./parameters/types/ColorParameter.js'),
  MemberParameter: require('./parameters/types/MemberParameter.js'),
  NumberParameter: require('./parameters/types/NumberParameter.js'),
  StringParameter: require('./parameters/types/StringParameter.js'),
  UserParameter: require('./parameters/types/UserParameter.js'),
  GuildParameter: require('./parameters/types/GuildParameter.js'),
  RoleParameter: require('./parameters/types/RoleParameter.js'),
  EmojiParameter: require('./parameters/types/EmojiParameter.js')
}
