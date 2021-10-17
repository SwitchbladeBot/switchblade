const { ShardingManager } = require('discord.js')
const dotenv = require("dotenv")

dotenv.config({"path": "./.env.example"})
const manager = new ShardingManager('./index.js', {
  token: process.env.DISCORD_TOKEN,
  totalShards: parseInt(process.env.SHARD_COUNT) || 'auto'
})

manager.spawn()
manager.on('shardCreate', shard => console.log(`Launching shard ${shard.id}`))
