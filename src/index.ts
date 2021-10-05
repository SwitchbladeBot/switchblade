import dotenv from 'dotenv';
import { readFileSync } from 'fs';
dotenv.config();

console.log(readFileSync('bigtitle.txt', 'utf8').toString() + '\n');
import { Main } from './Main';
const main = new Main();
main.init();
