const express = require('express');
const app = express();
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000

app.use(express.json());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);



// getProjects
apiRouter.get('/projects/:user', async(req, res) => {
    const user = req.params.user;
    const projects = await DB.getProjects(user);
    res.send(projects);
});

// getProject
apiRouter.get('/project/:user/:name', async(req, res) => {
    const user = req.params.user;
    const projName = req.params.name;
    const project = await DB.getProject(user, projName);
    res.send(project);
});

// addProject
apiRouter.put('/project/:user', async (req, res) => {
    const user = req.params.user;
    DB.addProject(req.body);
    const projects = await DB.getProjects(user);
    res.send(projects);
});

// updateProject
apiRouter.post('/project/:user/:name', async (req, res) => {
    const user = req.params.user;
    const projName = req.params.name;
    DB.updateProject(user, projName, req.body);
    const projects = await DB.getProjects(user);
    res.send(projects);
});

// deleteProjects
apiRouter.delete('/projects/:user', (req, _res) => {
    const user = req.params.user;
    console.log(user);
    DB.deleteProjects(user);
});

// deleteProject
apiRouter.delete('/project/:user/:name', async (req, res) => {
    const user = req.params.name;
    const projName = req.params.name;
    DB.deleteProject(user, projName);
    const projects = await DB.getProjects(user);
    res.send(projects)
});



// getMembers
apiRouter.get('/members/:user', async (req, res) => {
    const user = req.params.user;
    const members = await DB.getPastMembers(user);
    res.send(members);
});

// setMembers
apiRouter.put('/members/:user', async (req, _res) => {
    const user = req.params.user;
    DB.setPastMembers(user, req.body);
});

// addMember
apiRouter.post('/members/:user/:member', async (req, res) => {
    const user = req.params.user;
    const member = req.params.member;
    DB.addPastMember(user, member);
    const members = await DB.getPastMembers(user);
    res.send(members);
});

// deleteMembers
apiRouter.delete('/members/:user', (req, _res) => {
    const user = req.params.user;
    DB.deletePastMembers(user);
});

// removeMember
apiRouter.delete('members/:user/:member', async (req, res) => {
    const user = req.params.user;
    const member = req.params.member;
    DB.removePastMember(user, member);
    const members = await DB.getPastMembers(user);
    res.send(members);
})



app.use((_req, res) => {
    res.sendFile('index.html', {root: 'public'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
