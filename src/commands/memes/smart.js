const { Command } = require('../../')

module.exports = class Smart extends Command {

  constructor(client) {
    super(client);

    this.name = "smart";
  }

  run(message) {
    let embed = this.client.getDefaultEmbed(message.author);
    embed.setImage('https://i.imgur.com/MzwiZg8.png');
    message.channel.send({embed});
  }

}
