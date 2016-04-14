const chalk = require('chalk');
const chalkLog = (message, color) => console.log(chalk[color || 'cyan'](message));

module.exports = ()=> ({
   e: message=> console.log(chalk['red'](message)),
    i: message=> console.log(chalk['cyan'](message))
});