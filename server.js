const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef)
const userPackage = grpcObject.userPackage;
const { pool } = require('./db/connect');
const bcrypt = require('bcrypt')
const saltRounds = 10

const server = new grpc.Server();
server.bind('0.0.0.0:7111', grpc.ServerCredentials.createInsecure());


server.addService(userPackage.UserService.service, {
    "createUser": createUser,
    "login": login,
    "updateUser": updateUser,
    "getUser": getUser,
    "getAllUsers": getAllUsers
})

server.start();

async function createUser(call, callback) {

    const hashedPassword = await bcrypt.hash(call.request.password, saltRounds);

    console.log(call.request);
    const sql = `
        INSERT INTO user(name, email, hashedPassword, address)
        VALUES ('${call.request.name}', '${call.request.email}', '${hashedPassword}', '${call.request.address}')
    `;

    await pool.query(sql)

    // callback(null, )

    // createUserDB
}

async function login(call, callback) {

    try {
        const email = call.request.email;

        console.log(call.request)

        const sql = `
        SELECT * FROM user
        WHERE email = '${email}'
        `;

        const res = await pool.query(sql);

        const data = res[0][0];

        console.log(data)

        const hashedPassword = data.hashedPassword

        const passwordMatched = await bcrypt.compare(call.request.password, hashedPassword);

        if (passwordMatched) {
            console.log("matched")
            callback(null, data)
        }
        else {
            throw new Error('Password did not matched')
        }

    } catch (err) {
        console.log(err)
        err.code = grpc.status.INVALID_ARGUMENT
        callback(err)
    }






}
function updateUser(call, callback) {

}
function getUser(call, callback) {

}
function getAllUsers(call, callback) {

}