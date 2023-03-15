let projName;
let project;

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

    addTask();
}

function parseIconPath(icon) {
    return '/images/icons/' + icon + '.svg#' + icon;
}

loadProject();