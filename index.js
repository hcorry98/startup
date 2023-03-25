const express = require('express');
const app = express();
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000

app.use(express.json());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get('/projects', async(_req, res) => {
    const projects = await DB.getProjects();
    res.send(projects);
});

apiRouter.get('/project', async(req, res) => {
    const projName = req.query.project;
    const project = await DB.getProject(projName);
    res.send(project);
});

apiRouter.put('/project', async (req, res) => {
    DB.addProject(req.body);
    const projects = await DB.getProjects();
    res.send(projects);
});

apiRouter.post('/project', async (req, res) => {
    const projName = req.query.project;
    DB.updateProject(projName, req.body);
    const projects = await DB.getProjects();
    res.send(projects);
});

apiRouter.delete('/projects', (_req, _res) => {
    DB.deleteProjects();
});

apiRouter.delete('/project', async (req, res) => {
    const projName = req.query.project;
    DB.deleteProject(projName)
    const projects = await DB.getProjects();
    res.send(projects)
});

app.use((_req, res) => {
    res.sendFile('index.html', {root: 'public'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
