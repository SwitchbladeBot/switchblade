const { Command, SwitchbladeEmbed, Constants } = require('../../');
const npm = require('api-npm');

module.exports = class Npm extends Command {
  constructor (client) {
    super(client)
    this.name = 'npm'
  }

  run (message, args) {
    const embed = new SwitchbladeEmbed(message.author);
    if (args[0]) {
      npm.getdetails(args.join('-'), data => {
        if (data.name) {
          embed.setAuthor(data.name, 'https://i.imgur.com/24yrZxG.png', `https://www.npmjs.com/package/${data.name}`);
          embed.setDescription(`${data.description}\nhttps://www.npmjs.com/package/${data.name}\n\n\`npm i ${data.name} --save\``);
        } else {
          embed.setColor(Constants.ERROR_COLOR);
          embed.setAuthor('Package not found!');
          embed.setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <package name>\``);
        }
        message.channel.send({ embed });
      });
    } else {
      embed.setColor(Constants.ERROR_COLOR);
      embed.setAuthor('You need to give me a package name.');
      embed.setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <package name>\``);
      message.channel.send({ embed });
    }
  }
}
