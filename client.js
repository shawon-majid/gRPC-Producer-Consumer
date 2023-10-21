const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef)
const userPackage = grpcObject.userPackage;
const readline = require('readline');

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function question(prompt) {
    return new Promise((resolve) => {
        r1.question(prompt, resolve);
    });
}

async function login() {
    const email = await question('Email: ');
    const password = await question('Password: ');

    try {
        const result = await new Promise((resolve, reject) => {
            client.login({
                email: email,
                password: password
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        console.log('Login successful:', result);
        return true;
        // Proceed with the next steps here
    } catch (error) {
        console.error('Login failed');
        return false;
        // Handle the error as needed
    }
}


const client = new userPackage.UserService('localhost:7111', grpc.credentials.createInsecure());

(async () => {

    while (true) {

        let qText = "Choose 1 option:\n1 - Login\n2 - Signup\n";

        const option = await question(qText)

        console.log(option);

        if (option == 1) {
            console.log('Loading login Screen');

            const loggedin = await login();

            if (loggedin) {
                // show profiles
            }
        }
        else {
            console.log('Loading Signup Screen');

            const name = await question('Name: ');
            const email = await question('Email: ');
            const password = await question('Password: ');
            const address = await question('Address: ');

            await client.createUser({
                name: name,
                email: email,
                password: password,
                address: address
            }, (err, res) => {
                if (err) {
                    console.log(err)
                }
            })

            continue;

        }

    }

})();