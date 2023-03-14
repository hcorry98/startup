function LoadProjects() {
    let projects = {};
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects = JSON.parse(projectsText);
    }

    let mainEl = document.querySelector('body main');

    if (projects.length) {
        for (const [i, project] of projects.entries()) {
            const name = project.name;
            const icon = project.icon;
            const myProg = project.my-progress;
            const teamProg = project.team-progress;

            let nextProj = document.querySelector("div[data-type='template']").cloneNode(true);

            nextProj.querySelector("h3").textContent = project.name;
            nextProj.querySelector("svg use").href = ParseIconPath(project.icon);
            nextProj.querySelector(".my-progress .progress-bar").style = "width: " + project.myProg + "%";
            nextProj.querySelectorAll(".my-progress .progress-percent p")[1].textContent = project.myProg + "%";
            nextProj.querySelector(".team-progress .progress-bar").style = "width: " + project.teamProg + "%";
            nextProj.querySelectorAll(".team-progress .progress-percent p")[1].textContent = project.teamProg + "%";
            mainEl.appendChild(nextProj);
        }
    } else {
        const pEl = document.createElement('p');
        pEl.innerHTML = '<p>Create a project to start.</p>';
        mainEl.appendChild(pEl);
    }
}

function ParseIconPath(icon) {
    return '/images/icons/' + icon + '.svg#' + icon;
}

LoadProjects();

