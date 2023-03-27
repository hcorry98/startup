const {MongoClient} = require('mongodb');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
    throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const projectCollection = client.db('startup').collection('project');

function getProjects(curUser) {
    const query = {'user': curUser};
    const cursor = projectCollection.find(query, {_id: 0});
    return cursor.toArray();
}

function getProject(curUser, projName) {
    const query = {'user': curUser, 'project-name': projName};
    const cursor = projectCollection.findOne(query, {_id: 0});
    return cursor;
}
function addProject(project) {
    projectCollection.insertOne(project);
}

function updateProject(curUser, projName, project) {
    const query = {'user': curUser, 'project-name': projName};
    projectCollection.replaceOne(query, project);
}

function deleteProjects(curUser) {
    const query = {'user': curUser};
    projectCollection.deleteMany(query);
}

function deleteProject(curUser, projName) {
    const query = {'user': curUser, 'project-name': projName};
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
    memberCollection.deleteOne(curUser);
}

function removePastMember(curUser, exMember) {
    const query = {'user': curUser};
    memberCollection.updateOne(query, {'members': exMember});
}



module.exports = {
    getProjects, getProject, addProject, updateProject, deleteProjects, deleteProject,
    getPastMembers, setPastMembers, addPastMember, deletePastMembers, removePastMember
}
