let projName;
let project;
let projTasks;

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

    document.querySelector('.subtitle h2').textContent = projName;

    const icon = project['icon'];
    document.querySelector('.project-icon use').setAttribute('href', parseIconPath(icon));

    document.querySelector('.subtitle a').setAttribute('href', 'manage-project.html?project=' + projName);

    loadTasks();

    updatePercentages();
}

function loadTasks() {
    const myTasks = document.querySelectorAll('.accordion-item ul')[0];
    const teamTasks = document.querySelectorAll('.accordion-item ul')[1];

    projTasks = project['tasks'];

    const template = document.querySelector('#taskTmpl');
    for (const [taskName, task] of Object.entries(projTasks)) {
        const nextTask = template.content.cloneNode(true);
        nextTask.querySelector('label').textContent = taskName
        nextTask.querySelector('input').checked = task['completed'];

        if (task['assigned-to'] === 'Me') {
            myTasks.appendChild(nextTask);
        } else {
            teamTasks.appendChild(nextTask);
        }
    }
}

function changeTaskState(toggleEl) {
    const taskName = toggleEl.parentElement.querySelector('label').textContent;

    if (toggleEl.checked) {
        completeTask(taskName);
    } else {
        unfinishTask(taskName);
    }

    project['tasks'] = projTasks;

    let projects = {};
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects = JSON.parse(projectsText);
    }
    projects[projName] = project;
    localStorage.setItem('projects', JSON.stringify(projects));

    updatePercentages();
}

function completeTask(taskName) {
    const assignedTo = projTasks[taskName]['assigned-to'];
    projTasks[taskName] = {'assigned-to': assignedTo, 'completed': true};
}

function unfinishTask(taskName) {
    const assignedTo = projTasks[taskName]['assigned-to'];
    projTasks[taskName] = {'assigned-to': assignedTo, 'completed': false};
}

function updatePercentages() {
    const percentages = calcPercentages();
    const myProg = percentages[0];
    const teamProg = percentages[1];
    document.querySelector(".my-progress .progress-bar").style = "width: " + myProg + "%";
    document.querySelectorAll(".my-progress .progress-percent p")[1].textContent = myProg + "%";
    document.querySelector(".team-progress .progress-bar").style = "width: " + teamProg + "%";
    document.querySelectorAll(".team-progress .progress-percent p")[1].textContent = teamProg + "%";
}

function calcPercentages() {
    let myCompleted = 0;
    let myTotal = 0;
    let allCompleted = 0;
    let allTotal = 0;
    for (const [taskName, task] of Object.entries(projTasks)) {
        allTotal++;
        if (task['completed'] === true) {
            allCompleted++;
        }
        if (task['assigned-to'] === 'Me') {
            myTotal++;
            if (task['completed'] === true) {
                myCompleted++;
            }
        }
    }

    let myProg = (myCompleted / myTotal * 100);
    let teamProg = (allCompleted / allTotal * 100);

    if (myTotal === 0) {
        myProg = 0;
    }
    if (allTotal === 0) {
        teamProg = 0;
    }

    let decimalPlaces = 0;
    myProg = Number(Math.round(parseFloat(myProg + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
    teamProg = Number(Math.round(parseFloat(teamProg + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);

    return [myProg, teamProg];
}

function parseIconPath(icon) {
    return '/images/icons/' + icon + '.svg#' + icon;
}

loadProject();