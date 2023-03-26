let project;
let projName = '';
let icon = '';
let teamMembers = [];
let tasks = {};
let curUser = 'Hai'

projName = "Delligator";
icon = "device-laptop";
teamMembers = ["Me"];
tasks = {};
tasks['Implement JavaScript'] = {'assigned-to': 'Me', 'completed': false};
tasks['Buy domain name'] = {'assigned-to': 'Me', 'completed': true};
tasks['Setup web server'] = {'assigned-to': 'Me', 'completed': true};
tasks['Implement HTML'] = {'assigned-to': 'Me', 'completed': true};
tasks['Implement CSS'] = {'assigned-to': 'Me', 'completed': true};

project =  {'user': curUser, 'project-name': projName, 'icon': icon, 'teamMembers': teamMembers, 'tasks': tasks};

const DB = require('./database.js');

async function add(user, project) {
    DB.addProject(project);
    const projects = await DB.getProjects(user);
    console.log(projects);
}

async function getAll() {
    const projects = await DB.getProjects(user);
    console.log(projects)
}

add(curUser, project)