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

    console.log(myTasks);
    console.log(teamTasks);

    projTasks = project['tasks'];

    const template = document.querySelector('#taskTmpl');
    for (let task of projTasks) {
        const nextTask = template.content.cloneNode(true);
        nextTask.querySelector('label').textContent = task[0]
        nextTask.querySelector('input').checked = task[2];

        if (task[1] === 'Me') {
            myTasks.appendChild(nextTask);
        } else {
            teamTasks.appendChild(nextTask);
        }
    }
}

function changeTaskState() {

}

function completeTask() {

}

function unfinishTask() {

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
    for (let task of projTasks) {
        allTotal++;
        if (task[2] === true) {
            allCompleted++;
        }
        if (task[1] === 'Me') {
            myTotal++;
            if (task[2] === true) {
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