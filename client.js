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


const client = new userPackage.UserService('localhost:7111', grpc.credentials.createInsecure());

(async () => {

    let qText = "Choose 1 option:\n1 - Login\n2 - Signup\n";

    const option = await question(qText)

    console.log(option);

    if (option == 1) {
        console.log('Loading login Screen');
    }
    else {
        console.log('Loading Signup Screen');

        const name = await question('Name: ');
        const email = await question('Email: ');
        const password = await question('Password: ');
        const address = await question('Address: ');

        client.createUser({
            name: name,
            email: email,
            password: password,
            address: address
        }, (err, res) => {
            console.log(res);
        })

    }


})();