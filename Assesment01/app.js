const isEven = require('./modules/isEven.js');
const logger = require('./modules/logger.js');

let number = 10;

logger("Checking whether the number is even or odd.");

if (isEven(number)) {
    console.log(`${number} is Even`);
} else {
    console.log(`${number} is Odd`);
}