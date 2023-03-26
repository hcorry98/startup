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
    const options = {sort: {'project-name': 1}};
    const cursor = projectCollection.find(query, options);
    return cursor.toArray();
}

function getProject(curUser, projName) {
    const query = {'user': curUser, 'project-name': projName};
    const cursor = projectCollection.findOne(query);
    return cursor.toArray();
}
function addProject(project) {
    projectCollection.insertOne(project);
}

function updateProject(curUser, projName, project) {
    const query = {'user': curUser, 'project-name': projName};
    projectCollection.updateOne(query, project);
}

function deleteProjects(curUser) {
    const query = {'user': curUser};
    console.log(curUser);
    projectCollection.deleteMany(query);
}

function deleteProject(curUser, projName) {
    const query = {'user': curUser, 'project-name': projName};
    projectCollection.deleteOne(query);
}

module.exports = {getProjects, getProject, addProject, updateProject, deleteProjects, deleteProject}
