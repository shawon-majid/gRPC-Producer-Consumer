const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef)
const userPackage = grpcObject.userPackage;

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

function createUser(call, callback) {
    console.log(call.request);

    // createUserDB
}

function login(call, callback) {

}
function updateUser(call, callback) {

}
function getUser(call, callback) {

}
function getAllUsers(call, callback) {

}