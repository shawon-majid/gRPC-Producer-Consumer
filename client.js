const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef)
const userPackage = grpcObject.userPackage;
const readline = require('readline');
const { exit } = require('process');

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
        return result
        // Proceed with the next steps here
    } catch (error) {
        console.error('Login failed');
        // Handle the error as needed
    }
}

async function updateUser(currentUser) {
    // updateUser
    try {
        const result = await new Promise((resolve, reject) => {
            client.updateUser(currentUser, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        console.log('user updated successful');
        // Proceed with the next steps here
    } catch (error) {
        console.error('failed to update the user');
        // Handle the error as needed
    }
}

async function getAllUsers() {
    try {
        const result = await new Promise((resolve, reject) => {
            client.getAllUsers({}, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        console.log('users loading successful');
        return result
        // Proceed with the next steps here
    } catch (error) {
        console.error('failed to fetch the users');
        // Handle the error as needed
    }
}


const client = new userPackage.UserService('localhost:7111', grpc.credentials.createInsecure());

(async () => {

    while (true) {

        let qText = "Choose 1 option:\n1 - Login\n2 - Signup\n3 - Exit";

        const option = await question(qText)

        console.log(option);

        if (option == 1) {
            console.log('Loading login Screen');

            const data = await login();

            if (data) {

                const currentUser = data;

                while (true) {
                    console.log('Current User : ' + currentUser.name)
                    console.log('1 - Show All Profiles')
                    console.log('2 - Update My Profile')
                    console.log('3 - Logout')

                    const choice1 = await question('Choose one option: ');
                    if (choice1 == 1) {
                        const res = await getAllUsers();
                        let idx = 0
                        res.users.forEach(user => {
                            console.log(idx, user.name)
                            idx++;
                        });

                        while (1) {
                            const choice = await question('Choose to view profile (-1 to exit): ');
                            if (choice == -1) {
                                break;
                            }
                            console.log(res.users[choice])
                        }

                    }
                    else if (choice1 == 2) {
                        while (true) {
                            console.log('1 - Update Name')
                            console.log('2 - Update Address')
                            console.log('3 - Save')
                            const option = await question('Choose one option: ');

                            if (option == 1) {
                                const name = await question('Enter your new name: ');
                                currentUser.name = name;
                            }
                            else if (option == 2) {
                                const address = await question('Enter your new address: ');
                                currentUser.address = address;
                            }

                            else if (option == 3) {

                                await updateUser(currentUser)

                                console.log('saved the info!')
                                break;
                            }

                        }

                    }

                    if (choice1 == 3) {
                        break;
                    }
                }




            }
            else {
                console.log('here failed')
            }
        }
        else if (option == 2) {
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

        else if (option == 3) {
            exit(0);
        }

    }

})();