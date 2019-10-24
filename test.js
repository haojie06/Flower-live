
const { encode, decode } = require('fast-gbk')();

const str = '你好，世界！';

const arr = encode(str);

console.log(arr);
console.log(decode(arr));
