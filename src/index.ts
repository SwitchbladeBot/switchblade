import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install()

import dotenv from 'dotenv'
dotenv.config()

import Main from './Main';
const main = new Main()
main.init()