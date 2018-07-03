
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
    <a href="https://snyk.io/test/github/SwitchbladeBot/switchblade" target="_blank"><img src="https://snyk.io/test/github/SwitchbladeBot/switchblade/badge.svg" alt="Known Vulnerabilities"/></a>
    <a href="https://codeclimate.com/github/SwitchbladeBot/switchblade" target="_blank"><img src="https://img.shields.io/codeclimate/maintainability/SwitchbladeBot/switchblade.svg" alt="Code Climate"/></a>
    <a title="Crowdin" target="_blank" href="https://crowdin.com/project/switchblade"><img src="https://d322cqt584bo4o.cloudfront.net/switchblade/localized.svg"></a>
  </p>
</div>

## A completely open-source Discord bot project
**Switchblade** is an open-source multi purpose Discord bot, built for those who want structure quality, fine command organization, user enjoyability and ease of access when it comes to host it by yourself. Switchblade isn't supposed to be your average Discord bot. The objective of the project is to create a bot that does as many things as possible (just like an actual switchblade), and it also brings a new whole world of modularity and personal configuration, so that you can equip it with your favorite tools.

## Contributing
You want to help? Great! There are many ways to do it:

**Contribute with code:**
Setup a development environment, make some changes, and [open a pull request](https://github.com/SwitchbladeBot/switchblade/compare)

**Contribute with ideas:**
Have a great idea, but don't know how to code (or maybe you're just too lazy to do it)? No problem! [Open an issue](https://github.com/SwitchbladeBot/switchblade/issues/new) so we can talk about your awesome idea.

**Contribute by hunting bugs:**
Just like discord, we have an awesome team of bug hunters. You can [join our server](https://discord.gg/2FB8wDG) and ask for the **Bug Hunter™** role. After that, you can start hunting bugs and [reporting them](https://github.com/SwitchbladeBot/switchblade/issues/new?template=Bug_report.md).

**Contribute with translations:**
Switchblade's translation is Crowdsourced too! [Click here to learn more](https://crowdin.com/project/switchblade)

## Branching
New Pull Requests should be made upon the `dev` branch, where **Switchblade Canary**, our private testing instance, runs. Every two weeks, we push code from `dev` to `master`, where the production instance runs.

## Setting up a development environment
> For this guide, we're assuming that you already have NPM, Node and Windows Build Tools installed.

**1. Clone the repository and checkout the `dev` branch**
```bash
git clone https://github.com/SwitchbladeBot/switchblade
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
The `start-dev` script loads the variables from `.env` into the process, and automatically restart the bot when you make changes to the code.

Happy hacking!
