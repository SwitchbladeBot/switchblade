const { Command, SwitchbladeEmbed, Constants , PermissionUtils } = require('../../')
const mongoose = require('mongoose')
const moment = require('moment')
const schedule = require('node-schedule')
const RolesRepository = require('../../database/mongo/repositories/RolesRepository')

const SUB_COMMANDS = ['set', 'role']

module.exports = class Birthday extends Command {
  constructor (client) {
    super({
      name: 'birthday',
      parameters: [{
        type: 'string',
        full: false,
        clean: true,
        whitelist: SUB_COMMANDS,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:birthday.noText'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:birthday.availble')}:**__`,
              `**${SUB_COMMANDS.map(l => `\`${l}\``).join(', ')}**`
            ].join('\n'))
        }
      }, {
        type: 'string',
        full: false,
        clean: true
      }]
    },
    client)

    this.mongo = new RolesRepository(mongoose)

    this.subcommands = [
      new CMDSet(client, this.mongo),
      new CMDRole(client, this.mongo)
    ]

    this.rolesMap = new Map()

    const rule = new schedule.RecurrenceRule()

    rule.hour = 0

    rule.minute = 0

    schedule.scheduleJob(rule, this.checkForBirthdays)
  }

  checkForBirthdays () {
    try {
      const guildId = Array.from(this.client.guilds.cache)[0][0]

      const list = this.client.guilds.cache.get(guildId)

      this.client.guilds.cache.first().roles.cache.forEach(role => {
        this.rolesMap[role.name] = role
      })

      this.mongo.get('role').then((res) => {
        const giftRole = res.giftedRole

        if (!giftRole) return

        const birthdayUsers = []

        for (const user of res.users) {
          const currentDate = moment()

          currentDate.format('DD/MM')

          const userBirthday = moment(user.birthday, 'DD/MM', true)

          if (currentDate.date() === userBirthday.date()) {
            birthdayUsers.push(user.username)
          }
        }

        list.members.cache.array().forEach(async member => {
          if (birthdayUsers.includes(member.user.username)) {
            await member.roles.add(this.rolesMap[giftRole])
          }
        })
      })
    } catch { }
  }
}

class CMDSet extends Command {
  constructor (client , mongodb) {
    super({"name": "set"} , client)
    this.mongodb = mongodb
  }

  async run ({ channel, message }, birthday) {
    const username = await message.author.username

    const dateInMoment = moment(birthday, 'DD/MM', true)

    if (!dateInMoment.isValid()) {
      this.sendEmbed(channel, username, 'Invalid Date', `Invalid date ${birthday}. Make sure it is in format of DD/MM`, Constants.ERROR_COLOR)

      return
    }

    const currentUsers = await this.mongo.get('role')

    let flag = false

    for (const [index, user] of currentUsers.users.entries()) {
      if (user.username === username) {
        const entity = {}

        const newKeyValue = {}

        newKeyValue[`users.${index}.birthday`] = birthday

        entity.$set = newKeyValue

        await this.mongo.update('role', entity, { upsert: false })

        flag = true

        break
      }
    }

    if (!flag) {
      await this.mongo.update('role', {
        $push: {
          users: {
            username: username,
            birthday: birthday
          }
        }
      })
    }

    this.sendEmbed(channel, username, 'Success', 'Successfully added your birthday', Constants.SUCCESS_COLOR)
  }
}

class CMDRole extends Command {
  constructor (client, mongodb) {
    super({name: "role"} , client)
    this.mongo = mongodb
  }

  async run ({ channel, message }, role) {
    const user = message.mentions.users.first() || message.author

    let flag = true

    // message.guild.member(user).roles.cache.forEach(r => {
    //   if (r.name === 'MANAGE_ROLE') {
    //     flag = false
    //   }
    // })
    console.log(await PermissionUtils.isManager(this.client , user))

  //   if (flag) {
  //     this.sendEmbed(channel, message.author.username, 'Invalid Permissions', 'You cannot set the gift role because you do not have the role of MANAGE_ROLE!', Constants.ERROR_COLOR)

  //     return
  //   }

  //   flag = true

  //   message.guild.roles.cache.forEach(r => {
  //     if (r.id === role || r.name === role) {
  //       flag = false
  //     }
  //   })

  //   if (flag) {
  //     this.sendEmbed(channel, message.author.username, 'Invalid Role', `Sorry, but it looks like role ${role} does not exist.`, Constants.ERROR_COLOR)

  //     return
  //   }

  //   await this.mongo.update('role', { giftedRole: role })

  //   this.sendEmbed(channel, 'Success', `Role ${role} will be given to member's birthday!`, Constants.SUCCESS_COLOR)
  // }
  }
}
