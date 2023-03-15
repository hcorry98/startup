let project;
let projName;
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
    projTasks = project['tasks'];

    document.querySelector('.project-name').textContent = projName;

    const icon = project['icon'];
    document.querySelector('.project-icon use').setAttribute('href', parseIconPath(icon));

    document.querySelector('.subtitle a').setAttribute('href', 'project.html?project=' + projName);

    document.querySelector('.manage-btns #btn-new-tasks').setAttribute('href', 'new-tasks.html?project=' + projName);
    document.querySelector('.manage-btns #btn-man-team').setAttribute('href', 'manage-team.html?project=' + projName);

    updatePercentages();

    loadTasks();
}

function loadTasks() {

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
