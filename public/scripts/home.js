let curUser = '';

async function getName() {
    let user = await fetch(`/api/user/${curUser}`);
    user = await user.json();
    const fullName = user.firstName + " " + user.lastName;
    return fullName;
}

async function toastWelcome() {
    let toastEl = document.getElementById("welcomeToast");

    let myToast = bootstrap.Toast.getOrCreateInstance(toastEl, {
        delay: 3000
    });
    const fullName = await getName();
    toastEl.querySelector(".toast-body").textContent = "Welcome " + fullName + "!";
    myToast.show();
}

async function LoadProjects() {
    let projects = [];
    curUser = localStorage.getItem('username') ?? 'Mystery User';

    try {
        const response = await fetch(`/api/projects/${curUser}`);
        projects = await response.json();

        localStorage.setItem('projects', JSON.stringify(projects));
    } catch {
        const projectsText = localStorage.getItem('projects');
        if (projectsText) {
            projects = JSON.parse(projectsText);
        }
    }

    displayProjects(projects)

    const justLoggedIn = localStorage.getItem("justLoggedIn")

    if (justLoggedIn === "true") {
        localStorage.setItem('justLoggedIn', "false");
        toastWelcome();
    }
}

function displayProjects(projects) {
    let mainEl = document.querySelector('body main');

    if (projects.length) {
        for (let project of projects) {
            const name = project['project-name']
            const icon = project['icon']
            const tasks = project['tasks']

            const results = calcPercentages(tasks);
            const myProg = results[0];
            const teamProg = results[1];

            let nextProj = document.querySelector("#projProgTmpl").content.cloneNode(true);

            nextProj.querySelector("a").href = "project.html?project=" + name;
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
    for (const [taskName, task] of Object.entries(tasks)) {
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

function ParseIconPath(icon) {
    return 'assets/images/icons/' + icon + '.svg#' + icon;
}

LoadProjects();


