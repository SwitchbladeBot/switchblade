module.exports = {
  Command: require('./Command.js'),
  CommandParameters: require('./parameters/CommandParameters.js'),
  CommandRequirements: require('./CommandRequirements.js'),

  // Parameters
  Parameter: require('./parameters/types/Parameter.js'),
  NumberParameter: require('./parameters/types/NumberParameter.js'),
  StringParameter: require('./parameters/types/StringParameter.js'),
  UserParameter: require('./parameters/types/UserParameter.js')
}
