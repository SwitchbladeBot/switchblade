
<div align="center">
  <img src="https://i.imgur.com/LID4HYe.png"><br>
  <img src="https://i.imgur.com/SVyi88i.png"><br>
  <b>Multi purpose Discord Bot made using discord.js, focused on quality, organization and enjoyability.</b><br><br>

  <p>
    <a href="https://discord.gg/PwWJRsc" target="_blank"><img src="https://img.shields.io/badge/dynamic/json.svg?label=chat%20on%20Discord&colorB=7289DA&url=https%3A%2F%2Fdiscordapp.com%2Fapi%2Fservers%2F445203868624748555%2Fembed.json&query=%24.members.length&suffix=%20online" alt="Discord Server"/></a>
    <a href="https://invite.switchblade.xyz/" target="_blank"><img
    src="https://img.shields.io/badge/invite-to%20your%20Discord%20server-7289da.svg" alt "Invite Switchblade"></a>
    <a href="https://github.com/SwitchbladeBot/switchblade/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/SwitchbladeBot/switchblade.svg" alt="License"/></a>
    <a href="https://travis-ci.org/SwitchbladeBot/switchblade" target="_blank"><img src="https://api.travis-ci.org/SwitchbladeBot/switchblade.svg" alt="Travis CI Build Status"/></a>
    <a href="https://snyk.io/test/org/xdoges/switchblade" target="_blank"><img src="https://snyk.io/test/org/xdoges/switchblade/badge.svg" alt="Known Vulnerabilities"/></a>
    <a title="Crowdin" target="_blank" href="https://translate.switchblade.xyz/project/switchblade"><img src="https://d322cqt584bo4o.cloudfront.net/switchblade/localized.svg"></a>
  <a class="badge-align" href="https://www.codacy.com/app/Doges/switchblade?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SwitchbladeBot/switchblade&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/4f29cb30be614ad3a5af1fa381efa9f7"/></a>
    <br>
    Vote on <a href="https://discordbots.org/bot/445277324175474689/vote" target="_blank">DBL</a>
  </p>
</div>

## The open source Discord bot
**Switchblade** is a free and open source solution to all of your server managing problems, built from scratch with code organization and quality in mind. Want some music for your server? We've got you covered. Maybe you want a good anti-spam solution? We've got you covered. How about economy? Well, you probably got it by now. [Like the idea? Click here to invite Switchblade to your server](http://invite.switchblade.xyz/).

## Contributing
You want to help? Great! There are many ways to do it:

**Contribute with code:**
Setup a development environment, make some changes, and [open a pull request](https://github.com/SwitchbladeBot/switchblade/compare).

**Contribute with ideas:**
Have a great idea, but don't know how to code (or maybe you're just too lazy to do it)? No problem! [Open an issue](https://github.com/SwitchbladeBot/switchblade/issues/new) so we can talk about your awesome idea.

**Contribute by hunting bugs:**
Just like Discord, we have an awesome team of bug hunters. You can [join our server](https://discord.gg/2FB8wDG) and ask for the **Bug Hunter™** role. After that, you can start hunting bugs and [reporting them](https://github.com/SwitchbladeBot/switchblade/issues/new?template=Bug_report.md).

**Contribute with translations:**
Switchblade's translation is Crowdsourced too! [Click here to learn more](https://crowdin.com/project/switchblade).

## Branching
New Pull Requests should be made upon the `dev` branch, where **Switchblade Canary**, our private testing instance, runs. Every two weeks, we push code from `dev` to `master`, where the production instance runs.

## Setting up a development environment
> For this guide, we're assuming that you already have NPM, Node and Windows Build Tools installed.

**0. Fork the repository** (You don't have to do this if you're part of our organization)


**1. Clone your fork and checkout the `dev` branch**
```bash
git clone https://github.com/<your username>/switchblade
cd switchblade
git checkout dev
```

**2. Install all the dependencies with NPM**
```bash
npm install
```

**3. Create a file named `.env` inside of the bot's folder and add all of the [required environment variables](https://github.com/SwitchbladeBot/switchblade/wiki/Environment-Variables) to it.**

In the end, your file should look like this:
```
DISCORD_TOKEN=NDQ0OTU4ODkyMzgwNzgyNTky.Dhxlog.2VyI9uaXRO0t36vMsH5wVDjqpfk
PREFIX=s!
```

**4. Run the bot!**
```
npm run start-dev
```
The `start-dev` script loads the variables from `.env` into the process, and automatically restarts the bot when you make changes to the code.

Happy hacking!

<div align="center">
  <img src="https://botsfordiscord.com/api/v1/bots/445277324175474689/embed"> <img src="https://discordbots.org/api/widget/445277324175474689.svg">
</div>
