let project;
let projName;
let numTasks = 0;

// TODO: Check to see if task already exists
//       If it does, give error

function getProject() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    projName = urlParams.get('project');
    let projects = {};
    const projectText = localStorage.getItem('projects');
    if (projectText) {
        projects = JSON.parse(projectText);
    }
    return projects[projName];
}

function loadProject() {
    const proj = getProject();
    project = proj;

    document.querySelector('.project-name').textContent = projName;

    const icon = project['icon'];
    document.querySelector('.project-icon use').setAttribute('href', parseIconPath(icon));

    document.querySelector('.subtitle a').setAttribute('href', 'project.html?project=' + projName);

    addTask();
}

function addTask() {
    const tableEl = document.querySelector('#new-task-table tbody');
    const template = document.querySelector('#newTaskTmpl');
    let newTask = template.content.cloneNode(true);

    if (numTasks === 0) {
        const useEl = newTask.querySelector("svg use");
        useEl.setAttribute('href', '');
    } else if (numTasks === 1) {
        const useEl = document.querySelectorAll('#new-task-table use')[1];
        useEl.setAttribute('href', '/images/circle-minus.svg#circle-minus');
    }

    const teamMembers = project['team-members']
    const selectEl = newTask.querySelector('select');
    for (member of teamMembers) {
        const optionEl = document.createElement('option');
        optionEl.textContent = member;
        selectEl.appendChild(optionEl);
    }
    tableEl.appendChild(newTask);
    numTasks++;
}

function removeTask(el) {
    const rowEl = el.parentElement.parentElement;
    rowEl.remove();
    numTasks--;

    if (numTasks === 1) {
        const useEl = document.querySelectorAll('#new-task-table use')[1];
        useEl.setAttribute('href', '');
    }
}

function createTasks() {
    const newTasks = getNewTasks();
    const tasks = project['tasks'];
    for (const [taskName, task] of Object.entries(newTasks)) {
        tasks[taskName] = task;
    }
    project['tasks'] = tasks;

    let projects = {};
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects = JSON.parse(projectsText);
    }
    projects[projName] = project;
    localStorage.setItem('projects', JSON.stringify(projects));
}

function getNewTasks() {
    let newTasks = {};
    const newTasksEls = document.querySelectorAll('#new-task-table tbody tr');
    for (let taskEl of newTasksEls) {
        const newTaskName = taskEl.querySelector('input').value;
        if (newTaskName === '') {
            continue;
        }
        const memberSelectEl = taskEl.querySelector('select');
        let assignedTo = 'Unassigned';
        if (memberSelectEl.selectedIndex != 0) {
            assignedTo = memberSelectEl.options[memberSelectEl.selectedIndex].textContent;
        }
        newTasks[newTaskName] = {'assigned-to': assignedTo, 'completed': false};
    }
    console.log(newTasks);
    return newTasks;
}

function parseIconPath(icon) {
    return '/images/icons/' + icon + '.svg#' + icon;
}

loadProject();

