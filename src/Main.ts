import { Client } from "discord.js"

class Main {
  discord: Client

  constructor () {
    this.discord = new Client({
      intents: [
        "GUILDS"
      ]
    })
  }

  init () {
    this.discord.login(process.env.DISCORD_TOKEN)
  }
}

export default Main