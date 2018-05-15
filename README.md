
<div align="center">
  <img src="http://i.join-my.stream/Untitled-1.png"><br>
  <img src="http://i.join-my.stream/Untitled-2.png"><br>
  <b>Multi purpose Discord Bot made using discord.js, focused on quality, organization and enjoyability.</b><br><br>

  <p>
    <a href="https://discord.gg/PwWJRsc" target="_blank"><img src="https://img.shields.io/badge/dynamic/json.svg?label=chat%20on%20discord&colorB=7289DA&url=https%3A%2F%2Fdiscordapp.com%2Fapi%2Fservers%2F445203868624748555%2Fembed.json&query=%24.members.length&suffix=%20online" alt="Discord Server"/></a>
    <a href="https://discordapp.com/api/oauth2/authorize?client_id=445277324175474689&permissions=0&scope=bot" target="_blank"><img
    src="https://img.shields.io/badge/invite-to%20your%20Discord%20server-7289da.svg" alt "Invite Switchblade"></a>
    <a href="https://github.com/SwitchbladeBot/switchblade/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/SwitchbladeBot/switchblade.svg" alt="License"/></a>
    <a href="https://travis-ci.org/SwitchbladeBot/switchblade" target="_blank"><img src="https://api.travis-ci.org/SwitchbladeBot/switchblade.svg" alt="Travis CI Build Status"/></a>
    <a href="https://snyk.io/test/github/SwitchbladeBot/switchblade" target="_blank"><img src="https://snyk.io/test/github/SwitchbladeBot/switchblade/badge.svg" alt="Known Vulnerabilities"/></a>
    <a href="https://codeclimate.com/github/SwitchbladeBot/switchblade" target="_blank"><img src="https://img.shields.io/codeclimate/maintainability/SwitchbladeBot/switchblade.svg" alt="Code Climate"/></a>
  </p>
</div>

## A completely open-source Discord bot project
**Switchblade** is an open-source multi purpose Discord bot, built for those who want structure quality, fine command organization, user enjoyability and ease of access when it comes to host it by yourself. Switchblade isn't supposed to be your average Discord bot. The objective of the project is to create a bot that does as many things as possible (just like an actual switchblade), and it also brings a new whole world of modularity and personal configuration, so that you can equip it with your favorite tools.

## How to install
First of all, clone the GitHub repository to your local drive and navigate to its folder with
```shell
git clone https://github.com/SwitchbladeBot/switchblade && cd switchblade
```
*(Ensure that you have [Git](http://git-scm.com/downloads), [Node.js with npm](https://nodejs.org/en/download/) and [Windows Build Tools](https://www.npmjs.com/package/windows-build-tools) installed before doing anything)*

After that, execute ```npm install --production``` if you're running a local instance for production or ```npm install``` if you're running a non production instance.

If you're running a production instance or a normal instance, make sure to read [this](https://github.com/SwitchbladeBot/switchblade/wiki/Environment-Variables) so that you can get to know what you will need to run a Switchblade local instance.
After you've checked them, if you're running a local instance, add those environment variables within a .env file. Example:
```
DISCORD_TOKEN=MjEwOTE2ODc1OTg3MTQ0NjA5.lFE3aA.CQiNp7rRa9VaXZEcpTRYReDo8UP
PREFIX=s!
```
Then, run ```npm run start-dev```

If you're running it on Heroku, just add [those same environment variables](https://github.com/SwitchbladeBot/switchblade/wiki/Environment-Variables) within the *Config Vars* section on the settings of your Heroku project ![Heroku Config Vars](http://i.join-my.stream/anBu07W.png)

Then, disable the *web* dyno within *Resources*, enable the *worker* dyno, and you're pretty much done! ![Heroku Resources](http://i.join-my.stream/ld8SQbi.png)

## Quick Links
* [Discord Server](https://discord.gg/PwWJRsc)
* [Trello Board](https://trello.com/b/cGBRYZhu/switchblade)
* [Wiki](https://github.com/SwitchbladeBot/switchblade/wiki)
* [Issues](https://github.com/SwitchbladeBot/switchblade/issues)

## Contributing
If you'd like to contribute, fork this repository, edit / add something in it, and make a Pull Request, or you can give ideias in [its Discord Server](https://discord.gg/PwWJRsc). It can't be any type of hardcoded bullsh*ttery, try to avoid it as much as possible.

## License and Copyright
```
Copyright (c) 2018 SwiftBlade

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
