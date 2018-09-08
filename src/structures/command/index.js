module.exports = {
  Command: require('./Command.js'),
  CommandContext: require('./CommandContext.js'),
  CommandParameters: require('./parameters/CommandParameters.js'),
  CommandRequirements: require('./CommandRequirements.js'),

  // Parameters
  Parameter: require('./parameters/types/Parameter.js'),
  ColorParameter: require('./parameters/types/ColorParameter.js'),
  MemberParameter: require('./parameters/types/MemberParameter.js'),
  NumberParameter: require('./parameters/types/NumberParameter.js'),
  StringParameter: require('./parameters/types/StringParameter.js'),
  UserParameter: require('./parameters/types/UserParameter.js'),
  GuildParameter: require('./parameters/types/GuildParameter.js')
}
