const { Command  , SwitchbladeEmbed , Constants} = require('../../')
const mongoose = require('mongoose')
const moment = require('moment')
const schedule = require("node-schedule")
const RolesRepository = require("../../database/mongo/repositories/RolesRepository")

module.exports = class Birthday extends Command {
  constructor(client) {
    super(
        {
          name: 'birthday',
          parameters: [{
            type: 'string',
            full: false,
            clean: true,
            missingError: "commands:birthday.missingSentence"
          } , {
            type: "string",
            full: false,
            clean: true,
          }]
        },
        client)
        
        this.mongo = new RolesRepository(mongoose)

        this.rolesMap = new Map()

        const rule = new schedule.RecurrenceRule()

        rule.hour = 0

        rule.minute = 0
        
        schedule.scheduleJob(rule , this.checkForBirthdays)
      }
      
  run({ channel, message }, subCommand , term) {
    if(subCommand === "role"){
      this.setRole(channel , message , term)
    } else{
      this.setUserBirthday(channel , message , term)
    }
  }

  async setRole(channel , message , term){
    const user = message.mentions.users.first() || message.author;

    var flag = true

    message.guild.member(user).roles.cache.forEach(r => {
      if(r.name === "MANAGE_ROLE"){
        flag = false

        return
      }
    })

    if(flag){
      this.sendEmbed(channel , message.author.username , "Invalid Permissions" , "You cannot set the gift role because you do not have the role of MANAGE_ROLE!" , Constants.ERROR_COLOR)

      return
    }

    flag = true

    message.guild.roles.cache.forEach(r => {
      if(r.id === term || r.name === term){
        flag = false

        return
      }
    })

    if(flag){
      this.sendEmbed(channel , message.author.username , "Invalid Role" , `Sorry, but it looks like role ${term} does not exist.` , Constants.ERROR_COLOR)

      return
    }
    
    await this.mongo.update("role" , {"giftedRole": term})

    this.sendEmbed(channel , "Success" , `Role ${term} will be given to member's birthday!` , Constants.SUCCESS_COLOR)
  }

  sendEmbed(channel , user , title , description , color){
    const embed = new SwitchbladeEmbed()
        .setTitle(title)
        .setFooter(user)
        .setDescription(description)
        .setColor(color)

    channel.send(embed)
  }

  async setUserBirthday(channel , message , term) {
    const username = await message.author.username

    const dateInMoment = moment(term , "DD/MM" , true)

    if(!dateInMoment.isValid()) {
      this.sendEmbed(channel , username , "Invalid Date" , `Invalid date ${term}. Make sure it is in format of DD/MM` , Constants.ERROR_COLOR)

      return
    }

    const currentUsers = await this.mongo.get("role")
    
    let flag = false

    for(const [index , user] of currentUsers.users.entries()){
      if(user.username === username){
        const entity = {}

        const newKeyValue = {}

        newKeyValue[`users.${index}.birthday`] = term

        entity["$set"] = newKeyValue

        await this.mongo.update("role" , entity , { upsert: false })

        flag = true

        break
      }
    }

    if(!flag){
      this.callback(username , term)
    }

    this.sendEmbed(channel , username , "Success" , "Successfully added your birthday" , Constants.SUCCESS_COLOR)
  }

  async callback(username , term) {
    await this.mongo.update("role" ,{
      "$push": {
        "users": {
          "username": username,
          "birthday": term
        }
      }
    })
  }

  checkForBirthdays = async () => {
    try{

      const guildId = Array.from(this.client.guilds.cache)[0][0]
      
      const list = this.client.guilds.cache.get(guildId)
  
      this.client.guilds.cache.first().roles.cache.forEach(role => {
        this.rolesMap[role.name] = role
      })
  
      this.mongo.get("role").then((res) => {
        const giftRole = res.giftedRole
  
        if(giftRole === "") return
  
        const birthdayUsers = []
  
        for(let user of res.users){
          const currentDate = moment()
  
          currentDate.format("DD/MM")
  
          const userBirthday = moment(user.birthday , "DD/MM" , true)
  
          if(currentDate.date() === userBirthday.date()){
            birthdayUsers.push(user.username)
          }
        }
  
        list.members.cache.array().forEach(async member => {
          if(birthdayUsers.includes(member.user.username)){
            await member.roles.add(this.rolesMap[giftRole])
          }
        })
      })
    }
    catch{ }
  }
}
