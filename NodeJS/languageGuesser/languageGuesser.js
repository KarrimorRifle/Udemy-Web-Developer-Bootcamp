import { createRequire } from "module";
const require = createRequire(import.meta.url)

import {franc, francAll} from 'franc';
var langs = require('langs');


let langCode = franc(process.argv[2]);
// console.log(process.argv[2]);
// console.log(guess);
let language = langs.where("3", langCode);
console.log(language.name);