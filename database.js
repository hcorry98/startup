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

function addProject(project) {
    projectCollection.insertOne(project);
}

function getProjects() {
    const curUser = 'TODO';
    const query = {user: curUser};
    const options = {
        sort: {projectName: 1}
    };
    const cursor = projectCollection.find(query);
    return cursor.toArray();
}

module.exports = {addProject, getProjects}
