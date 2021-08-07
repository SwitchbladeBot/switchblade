<div align="center">
  <img src="https://i.imgur.com/eSw0ZjQ.png"><br>
</div>

## Why are you rewriting the bot?
Switchblade is now over three years old. It's codebase has grown a lot over the years and served us well, but it's time to change. After a lot of discussion, the team has decided to rewrite the bot into [Eris](https://github.com/abalabahaha/eris), a more robust library for Discord bots. This decision was made due to the number of servers we are currently serving quickly getting closer to Discord's obligatory sharding point (2500 servers) and the inability of our current codebase to work well with shards.

## When is the rewrite going to be complete?
It will probably take some time for us to go over the whole thing and get everything working, but hold tight: the future is bright. As we rewrite each and every feature, we will also refactor our whole infrastructure, containerizing everything and splitting our code into multiple independent "services". This will allow for greater flexibility and less downtime when we create and deploy new features, resulting in a better experience. That said, we do not currently have a deadline, as we want to make sure everything works well and the changes go as smoothly as possible for the end user.

## What happens to the main branch when the rewrite is complete?
The new codebase will be moved from this branch to the main one, replacing the current `master` branch but keeping it's history avaliable.
