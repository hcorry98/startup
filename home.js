function LoadProjects() {
    let projects = {};
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects = JSON.parse(projectsText);
    }

    console.log(projectsText);
    console.log(projects);
    console.log(Object.keys(projects).length);

    let mainEl = document.querySelector('body main');

    if (Object.keys(projects).length) {
        for (const [projectName, project] of Object.entries(projects)) {
            const name = projectName;
            const icon = project.icon;
            const tasks = project.tasks;

            const results = calcPercentages(tasks);
            const myProg = results[0];
            const teamProg = results[1];

            let nextProj = document.querySelector("#projProgTmpl").content.cloneNode(true);

            nextProj.querySelector(".project-title h3").textContent = name;
            nextProj.querySelector("svg use").setAttribute('href', ParseIconPath(icon));
            nextProj.querySelector(".my-progress .progress-bar").style = "width: " + myProg + "%";
            nextProj.querySelectorAll(".my-progress .progress-percent p")[1].textContent = myProg + "%";
            nextProj.querySelector(".team-progress .progress-bar").style = "width: " + teamProg + "%";
            nextProj.querySelectorAll(".team-progress .progress-percent p")[1].textContent = teamProg + "%";
            mainEl.appendChild(nextProj);
        }
    } else {
        const pEl = document.createElement('p');
        pEl.innerHTML = '<p>Create a project to start.</p>';
        mainEl.appendChild(pEl);
    }
}

function calcPercentages(tasks) {
    let myCompleted = 0;
    let myTotal = 0;
    let allCompleted = 0;
    let allTotal = 0;
    for (task of tasks) {
        allTotal++;
        if (task[2] === true) {
            allCompleted++;
        }
        if (task[1] === 'me') {
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

function ParseIconPath(icon) {
    return '/images/icons/' + icon + '.svg#' + icon;
}

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    LoadProjects();
});


