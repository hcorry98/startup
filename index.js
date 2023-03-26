const express = require('express');
const app = express();
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000

app.use(express.json());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get('/projects/:user', async(req, res) => {
    const user = req.params.user;
    const projects = await DB.getProjects(user);
    res.send(projects);
});

apiRouter.get('/project/:user/:name', async(req, res) => {
    const user = req.params.user;
    const projName = req.params.name;
    const project = await DB.getProject(user, projName);
    res.send(project);
});

apiRouter.put('/project/:user', async (req, res) => {
    const user = req.params.user;
    DB.addProject(req.body);
    const projects = await DB.getProjects(user);
    res.send(projects);
});

apiRouter.post('/project/:user/:name', async (req, res) => {
    const user = req.params.user;
    const projName = req.params.name;
    DB.updateProject(user, projName, req.body);
    const projects = await DB.getProjects(user);
    res.send(projects);
});

apiRouter.delete('/projects/:user', (req, _res) => {
    const user = req.params.user;
    console.log(user);
    DB.deleteProjects(user);
});

apiRouter.delete('/project/:user/:name', async (req, res) => {
    const user = req.params.name;
    const projName = req.params.name;
    DB.deleteProject(user, projName)
    const projects = await DB.getProjects(user);
    res.send(projects)
});

app.use((_req, res) => {
    res.sendFile('index.html', {root: 'public'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
