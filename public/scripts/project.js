let projName;
let project;
let projTasks;

async function getProject() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    projName = urlParams.get('project');

    const curUser = localStorage.getItem('username') ?? 'public';

    try {
        const response = await fetch(`/api/project/${curUser}/${projName}`);
        project = await response.json();
    } catch {
        let projects;
        const projectsText = localStorage.getItem('projects');
        if (projectsText) {
            projects = JSON.parse(projectsText);
        }
        project = projects[projName]
    }
    delete project._id;
}

async function loadProject() {
    await getProject();

    document.querySelector('.project-name').textContent = projName;

    const icon = project['icon'];
    document.querySelector('.project-icon use').setAttribute('href', parseIconPath(icon));

    document.querySelector('#btn-new-tasks').setAttribute('href', 'manage-tasks.html?project=' + projName);
    document.querySelector('#btn-man-team').setAttribute('href', 'manage-team.html?project=' + projName);

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
        const isCompleted = task['completed']
        nextTask.querySelector('input').checked = isCompleted;

        if (task['assigned-to'] === 'Me') {
            if (isCompleted || !myTasks.hasChildNodes()) {
                myTasks.appendChild(nextTask);
            } else {
                myTasks.insertBefore(nextTask, myTasks.firstChild)
            }
        } else {
            if (task['assigned-to'] === 'Unassigned') {
                const iEl = document.createElement('i');
                iEl.textContent = ' - Unassigned';
                if (task['completed']) {
                    iEl.classList.add('completed');
                }
                nextTask.querySelector('div').appendChild(iEl);
            }
            if (isCompleted || !teamTasks.hasChildNodes()) {
                teamTasks.appendChild(nextTask);
            } else {
                teamTasks.insertBefore(nextTask, teamTasks.firstChild)
            }
        }
    }
}

async function changeTaskState(toggleEl) {
    const task = toggleEl.parentElement.querySelector('label');

    if (toggleEl.checked) {
        completeTask(task);
    } else {
        unfinishTask(task);
    }

    project['tasks'] = projTasks;

    let projects = [];
    const curUser = localStorage.getItem('username') ?? 'public';
    try {
        const response = await fetch(`/api/project/${curUser}/${projName}`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(project),
        });
        projects = await response.json();
        localStorage.setItem('projects', JSON.stringify(projects));
    } catch {
        const projectsText = localStorage.getItem('projects');
        if (projectsText) {
            projects = JSON.parse(projectsText);
        }
        for (const proj of projects) {
            if (proj['project-name'] === projName) {
                proj = project
            }
        }
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    updatePercentages();
}

function completeTask(task) {
    const taskName = task.textContent;
    const assignedTo = projTasks[taskName]['assigned-to'];
    projTasks[taskName] = {'assigned-to': assignedTo, 'completed': true};

    if (assignedTo === 'Unassigned') {
        task.parentElement.querySelector('i').classList.add('completed');
    }

    const taskItem = task.parentElement.parentElement
    const listOfTasks = taskItem.parentElement
    listOfTasks.appendChild(taskItem)
}

function unfinishTask(task) {
    const taskName = task.textContent;
    const assignedTo = projTasks[taskName]['assigned-to'];
    projTasks[taskName] = {'assigned-to': assignedTo, 'completed': false};

    if (assignedTo === 'Unassigned') {
        task.parentElement.querySelector('i').classList.remove('completed');
    }

    const taskItem = task.parentElement.parentElement
    const listOfTasks = taskItem.parentElement
    listOfTasks.insertBefore(taskItem, listOfTasks.firstChild)
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
    return 'assets/images/icons/' + icon + '.svg#' + icon;
}

function manage() {
    const manageDiv = document.querySelector('.manage-btns');
    const manageBtn = document.querySelector('#btn-man-proj');
    const manageSubtitle = document.querySelector('.subtitle i');
    if (manageDiv.style.display === 'flex') {
        manageDiv.style.display = 'none';
        manageBtn.textContent = 'Manage';
        manageSubtitle.textContent = '';
    } else {
        manageDiv.style.display = 'flex';
        manageBtn.textContent = 'Save';
        manageSubtitle.textContent = ' - Managing';
    }
}

loadProject();