const bcrypt = require('bcrypt')
const saltRounds = 10;

async function f() {
    const hashedp = await bcrypt.hash('123abc');

    console.log(hashedp)
}

f();