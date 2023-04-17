const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
    throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const projectCollection = client.db('startup').collection('project');
const userCollection = client.db('startup').collection('user');



function getUserFromEmail(email) {
    return userCollection.findOne({email: email});
}

function getUserFromUsername(username) {
    return userCollection.findOne({username: username});
}

function getUserByToken(token) {
    return userCollection.findOne({token: token});
}

async function createUser(username, email, password, firstName, lastName) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        username: username,
        email: email,
        password: passwordHash,
        firstName: firstName,
        lastName: lastName,
        token: uuid.v4()
    };
    await userCollection.insertOne(user);

    return user;
}



function getProjects(curUser) {
    const query = {'team-members.username': curUser};
    const cursor = projectCollection.find(query, {_id: 0});
    return cursor.toArray();
}

function getProject(curUser, projName) {
    const query = {'team-members.username': curUser, 'project-name': projName};
    const cursor = projectCollection.findOne(query, {_id: 0});
    return cursor;
}
function addProject(project) {
    projectCollection.insertOne(project);
}

function updateProject(curUser, projName, project) {
    const query = {'team-members.username': curUser, 'project-name': projName};
    projectCollection.replaceOne(query, project);
}

function deleteProjects(curUser) {
    const query = {'team-members.username': curUser};
    projectCollection.deleteMany(query);
}

function deleteProject(curUser, projName) {
    const query = {'team-members.username': curUser, 'project-name': projName};
    projectCollection.deleteOne(query);
}



const memberCollection = client.db('startup').collection('member');

function getPastMembers(curUser) {
    const query = {'user': curUser};
    const cursor = memberCollection.findOne(query, {_id: 0});
    return cursor;
}

function setPastMembers(curUser, members) {
    const query = {'user': curUser}
    memberCollection.replaceOne(query, members, {upsert: true});
}

function addPastMember(curUser, newMember) {
    const query = {'user': curUser};
    memberCollection.updateOne(query, {$push: {'members': newMember}}, {upsert: true});
}

function deletePastMembers(curUser) {
    const query = {'user': curUser}
    memberCollection.deleteOne(query);
}

function removePastMember(curUser, exMember) {
    const query = {'user': curUser};
    memberCollection.updateOne(query, {'members': exMember});
}



module.exports = {
    getUserFromEmail, getUserFromUsername, getUserByToken, createUser,
    getProjects, getProject, addProject, updateProject, deleteProjects, deleteProject,
    getPastMembers, setPastMembers, addPastMember, deletePastMembers, removePastMember
}
