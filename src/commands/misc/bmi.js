const { Command, SwitchbladeEmbed } = require('../../')

// Reference: https://en.wikipedia.org/wiki/Body_mass_index#Categories
const BMICategories = {
  verySeverelyUnderweight: {
    displayName: 'commands:bmi.categoryVerySeverelyUnderweight',
    color: '#2196F3',
    min: 0,
    max: 15
  },
  severelyUnderweight: {
    displayName: 'commands:bmi.categorySeverelyUnderweight',
    color: '#03A9F4',
    min: 15,
    max: 16
  },
  underweight: {
    displayName: 'commands:bmi.categoryUnderweight',
    color: '#00BCD4',
    min: 16,
    max: 18.5
  },
  normal: {
    displayName: 'commands:bmi.categoryNormal',
    color: '#4CAF50',
    min: 18.5,
    max: 25
  },
  overweight: {
    displayName: 'commands:bmi.categoryOverweight',
    color: '#FFEB3B',
    min: 25,
    max: 30
  },
  obese1: {
    displayName: 'commands:bmi.categoryObese1',
    color: '#FFC107',
    min: 30,
    max: 35
  },
  obese2: {
    displayName: 'commands:bmi.categoryObese2',
    color: '#FF9800',
    min: 35,
    max: 40
  },
  obese3: {
    displayName: 'commands:bmi.categoryObese3',
    color: '#FF5722',
    min: 40,
    max: Infinity
  }
}

module.exports = class BMI extends Command {
  constructor (client) {
    super({
      name: 'bmi',
      aliases: ['bodymassindex'],
      parameters: [
        {
          type: 'number',
          min: 0,
          required: true,
          missingError: 'commands:bmi.missingWeight'
        },
        {
          type: 'number',
          min: 0,
          required: true,
          missingError: 'commands:bmi.missingHeight'
        }
      ]
    }, client)
  }

  async run ({ t, channel }, weight, height) {
    const BMIValue = weight / Math.pow(height, 2)
    const { displayName, color } = Object.values(BMICategories).find(category =>
      BMIValue > category.min && BMIValue < category.max
    )
    // Format number to 2 nearest integers
    // https://stackoverflow.com/a/11832950
    const formattedBMIValue = Math.round((BMIValue + Number.EPSILON) * 100) / 100
    const embed = new SwitchbladeEmbed()
    embed
      .setTitle(t('commands:bmi.title', { value: formattedBMIValue }))
      .setDescription(t('commands:bmi.description', { category: t(displayName) }))
      .setColor(color)
      .setFooter(t('commands:bmi.footer'))
    channel.send(embed)
  }
}
