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

apiRouter.get('/project', async(_req, res) => {
    const projName = _req.query.project;
    const project = await DB.getProject(projName);
    res.send(project);
});

apiRouter.post('/project', async (req, res) => {
    DB.addProject(req.body);
    const projects = await DB.getProjects();
    res.send(projects);
});

app.use((_req, res) => {
    res.sendFile('index.html', {root: 'public'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
