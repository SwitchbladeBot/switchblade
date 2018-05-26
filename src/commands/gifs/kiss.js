const { Command, SwitchbladeEmbed } = require('../../')

const kissarray = ['https://em.wattpad.com/be664a8e8b471f49798ad367e7e809bea6dff987/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5470763473634d653344323357413d3d2d3331373535353132392e3134373938323930393132363361666232353737353336373930322e676966?s=fit&w=1280&h=1280', 'https://s-media-cache-ak0.pinimg.com/originals/54/31/62/5431628f9c32f0e804689c2c68db8a2a.gif', 'https://s-media-cache-ak0.pinimg.com/originals/af/ec/70/afec70ee60f45a2be98ba1a76385376a.gif']

module.exports = class Kiss extends Command {
  constructor (client) {
    super(client)
    this.name = 'kiss'
    this.aliases = ['beijo', 'beijar']
  }

  run (message) {
    const kissImg = kissarray[Math.floor(Math.random() * kissarray.length)]
    const user = message.mentions.users.first()
    if(!user) return message.channel.send('`s!kiss <@user>`')
    if (user.id === this.client.user.id) return message.channel.send('It\'s so sad looking at you alone')
    if(user.id === message.author.id) return message.channel.send('You can\'t kiss yourself')

    message.channel.send(
        new SwitchbladeEmbed(message.author)
        .setColor('#0000FF')
        .setImage(kissImg)
        .setDescription(`${message.author} kissed ${user}`)
    )
  }
}
