const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);



// register
apiRouter.post('/auth/register', async(req, res) => {
    if (await DB.getUserFromEmail(req.body.email)) {
        res.status(409).send({msg: 'That email is already registered to a user.'});
    } else if (await DB.getUserFromUsername(req.body.username)) {
        res.status(409).send({msg: 'That username is already taken.'});
    } else {
        const user = await DB.createUser(req.body.username, req.body.email, req.body.password, req.body.firstName, req.body.lastName);

        setAuthCookie(res, user.token);

        res.send({id: user._id});
    }
});

// login
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUserFromUsername(req.body.username);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({id: user._id});
            return;
        } else {
            res.status(401).send({msg: 'Incorrect password.'});
        }
    } else {
        res.status(401).send({msg: 'User does not exist.'});
    }
});

// logout the current user
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// Get information about the current user
apiRouter.get('/user/:username', async (req, res) => {
    const user = await DB.getUserFromUsername(req.params.username);
    if (user) {
        const token = req?.cookies.token;
        res.send({email: user.email, firstName: user.firstName, lastName: user.lastName, authenticated: token === user.token});
        return;
    }
    res.status(404).send({msg: 'Unknown'});
});



// secureApiRouter verifies credentials for endpoints
let secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
        next();
    } else {
        res.status(401).send({msg: 'Unauthorized'});
    }
});



// getProjects
secureApiRouter.get('/projects/:user', async(req, res) => {
    const user = req.params.user;
    const projects = await DB.getProjects(user);
    res.send(projects);
});

// getProject
secureApiRouter.get('/project/:user/:name', async(req, res) => {
    const user = req.params.user;
    const projName = req.params.name;
    const project = await DB.getProject(user, projName);
    res.send(project);
});

// addProject
secureApiRouter.put('/project/:user', async (req, res) => {
    const user = req.params.user;
    DB.addProject(req.body);
    const projects = await DB.getProjects(user);
    res.send(projects);
});

// updateProject
secureApiRouter.post('/project/:user/:name', async (req, res) => {
    const user = req.params.user;
    const projName = req.params.name;
    DB.updateProject(user, projName, req.body);
    const projects = await DB.getProjects(user);
    res.send(projects);
});

// deleteProjects
secureApiRouter.delete('/projects/:user', (req, _res) => {
    const user = req.params.user;
    DB.deleteProjects(user);
});

// deleteProject
secureApiRouter.delete('/project/:user/:name', async (req, res) => {
    const user = req.params.name;
    const projName = req.params.name;
    DB.deleteProject(user, projName);
    const projects = await DB.getProjects(user);
    res.send(projects)
});



// getMembers
secureApiRouter.get('/members/:user', async (req, res) => {
    const user = req.params.user;
    const members = await DB.getPastMembers(user);
    res.send(members);
});

// setMembers
secureApiRouter.put('/members/:user', async (req, _res) => {
    const user = req.params.user;
    DB.setPastMembers(user, req.body);
});

// addMember
secureApiRouter.post('/members/:user/:member', async (req, res) => {
    const user = req.params.user;
    const member = req.params.member;
    memberUser = await DB.getUserFromUsername(member);
    console.log(memberUser);
    if (memberUser) {
        memberUser = {'username': memberUser.username, 'firstName': memberUser.firstName, 'lastName': memberUser.lastName};
        let pastMembers = await DB.getPastMembers(user);
        pastMembers = pastMembers.members;
        if (!pastMembers.includes(memberUser)) {
            DB.addPastMember(user, memberUser);
        }
        const members = await DB.getPastMembers(user);
        res.send(members);
    }
    else {
        res.status(404).send({msg: 'Member not found'});
    }
});

// deleteMembers
secureApiRouter.delete('/members/:user', (req, _res) => {
    const user = req.params.user;
    DB.deletePastMembers(user);
});

// removeMember
secureApiRouter.delete('members/:user/:member', async (req, res) => {
    const user = req.params.user;
    const member = req.params.member;
    DB.removePastMember(user, member);
    const members = await DB.getPastMembers(user);
    res.send(members);
})



// Default error handler
app.use(function (err, _req, res, _next) {
    res.status(500).send({type: err.name, message: err.message});
});



app.use((_req, res) => {
    res.sendFile('index.html', {root: 'public'});
});

function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
    });
}

const httpService = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
