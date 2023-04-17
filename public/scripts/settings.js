function logout() {
    fetch(`/api/auth/logout`, {
        method: 'DELETE',
        headers: {'content-type': 'json/application'},
    });

    localStorage.removeItem("username");
}

function createProjects() {
    let project;
    let name = '';
    let icon = '';
    let teamMembers = [];
    let tasks = {};

    curUserText = localStorage.getItem('user');
    curUser = JSON.parse(curUserText);

    name = "Technical Instructions";
    icon = "pencil";
    teamMembers = [
        {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName},
        {'username': 'sCarson', 'firstName': 'Sarah', 'lastName': 'Carson'},
        {'username': 'lFreeman', 'firstName': 'Luke', 'lastName': 'Freeman'},
        {'username': 'mChartrand', 'firstName': 'Madison', 'lastName': 'Chartrand'}
    ];
    tasks['Take pictures'] = {'assigned-to': {'username': 'sCarson', 'firstName': 'Sarah', 'lastName': 'Carson'}, 'completed': false};
    tasks['Take minutes'] = {'assigned-to': {'username': 'lFreeman', 'firstName': 'Luke', 'lastName': 'Freeman'}, 'completed': true};
    tasks['Edit minutes'] = {'assigned-to': {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}, 'completed': true};
    tasks['Bring supplies'] = {'assigned-to': {'username': 'sCarson', 'firstName': 'Sarah', 'lastName': 'Carson'}, 'completed': false};
    tasks['Assign tasks'] = {'assigned-to': {'username': 'mChartrand', 'firstName': 'Madison', 'lastName': 'Chartrand'}, 'completed': false};
    tasks['Write instructions'] = {'assigned-to': {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}, 'completed': false};

    project = {'project-name': name, 'icon': icon, 'team-members': teamMembers, 'tasks': tasks};
    saveProject(project);

    name = "Data Finder";
    icon = "briefcase";
    teamMembers = [
        {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName},
        {'username': 'jAustin', 'firstName': 'Jonah', 'lastName': 'Austin'},
        {'username': 'cHardisty', 'firstName': 'Cassidy', 'lastName': 'Hardisty'},
        {'username': 'jTaylor', 'firstName': 'Jaden', 'lastName': 'Taylor'}
    ];
    tasks = {};
    tasks['Draw UML'] = {'assigned-to': {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}, 'completed': false};
    tasks['Add threading to functions'] = {'assigned-to': {'username': 'cHardisty', 'firstName': 'Cassidy', 'lastName': 'Hardisty'}, 'completed': true};
    tasks['Write documentation'] = {'assigned-to': {'username': 'jAustin', 'firstName': 'Jonah', 'lastName': 'Austin'}, 'completed': true};
    tasks['Design API'] = {'assigned-to': {'username': 'jAustin', 'firstName': 'Jonah', 'lastName': 'Austin'}, 'completed': true};
    tasks['Fix script'] = {'assigned-to': {'username': 'jTaylor', 'firstName': 'Jaden', 'lastName': 'Taylor'}, 'completed': true};

    project = {'project-name': name, 'icon': icon, 'team-members': teamMembers, 'tasks': tasks};
    saveProject(project);

    name = "Delligator";
    icon = "device-laptop";
    teamMembers = [{'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}];
    tasks = {};
    tasks['Implement JavaScript'] = {'assigned-to': {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}, 'completed': false};
    tasks['Buy domain name'] = {'assigned-to': {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}, 'completed': true};
    tasks['Setup web server'] = {'assigned-to': {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}, 'completed': true};
    tasks['Implement HTML'] = {'assigned-to': {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}, 'completed': true};
    tasks['Implement CSS'] = {'assigned-to': {'username': curUser.username, 'firstName': curUser.firstName, 'lastName': curUser.lastName}, 'completed': true};

    project =  {'project-name': name, 'icon': icon, 'team-members': teamMembers, 'tasks': tasks};
    saveProject(project);
}

async function saveProject(project) {
    curUsername = curUser.username
    try {
        const response = await fetch(`/api/project/${curUsername}`, {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(project),
        });

        const projects = await response.json();
        localStorage.setItem('projects', JSON.stringify(projects));
    } catch {
        updateProjectsLocal(project);
    }
}

function updateProjectsLocal(newProject) {
    let projects = {};
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects.JSON.parse(projectsText);
    }

    projects[newProject['name']] = newProject;

    localStorage.setItem('projects', JSON.stringify(projects));
}

async function deleteProjects() {
    curUserText = localStorage.getItem('user');
    curUser = JSON.parse(curUserText);
    curUsername = curUser.username
    let wantToDelete = confirm("Are you sure you want to delete all existing projects?");
    if (!wantToDelete) {
        return false;
    }
    try {
        await fetch(`/api/projects/${curUsername}`, {
            method: 'DELETE'
        });
    } finally {
        localStorage.removeItem('projects');
    }
}



async function createPastMembers() {
    curUserText = localStorage.getItem('user');
    curUser = JSON.parse(curUserText);
    const pastMembers = [
        {'username': 'TheTunaFish', 'firstName': 'Jake', 'lastName': 'Toone'},
        {'username': 'ThommyBoiL', 'firstName': 'Thomas', 'lastName': 'Lundquist'},
        {'username': 'Coleman22', 'firstName': 'Brock', 'lastName': 'Coleman'},
        {'username': 'sCarson', 'firstName': 'Sarah', 'lastName': 'Carson'},
        {'username': 'lFreeman', 'firstName': 'Luke', 'lastName': 'Freeman'},
        {'username': 'mChartrand', 'firstName': 'Madison', 'lastName': 'Chartrand'},
        {'username': 'haimears', 'firstName': 'Hailey', 'lastName': 'Mears'},
        {'username': 'jonny', 'firstName': 'Jonthan', 'lastName': 'Mears'},
        {'username': 'mcgloobaglobbin', 'firstName': 'Sterling', 'lastName': 'Connell'},
        {'username': 'jAustin', 'firstName': 'Jonah', 'lastName': 'Austin'},
        {'username': 'cHardisty', 'firstName': 'Cassidy', 'lastName': 'Hardisty'},
        {'username': 'jTaylor', 'firstName': 'Jaden', 'lastName': 'Taylor'}
    ]

    curUsername = curUser.username
    const pastMemberList = {'user': curUsername, 'members': pastMembers}

    try {
        await fetch(`/api/members/${curUsername}`, {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(pastMemberList)
        });
    } finally {
        localStorage.setItem('pastMembers', JSON.stringify(pastMemberList));
    }
}

async function deletePastMembers() {
    let wantToDelete = confirm("Are you sure you want to delete all past team members?");
    if (!wantToDelete) {
        return false;
    }
    curUserText = localStorage.getItem('user');
    curUser = JSON.parse(curUserText);
    curUsername = curUser.username
    try {
        await fetch(`api/members/${curUsername}`, {
            method: 'DELETE'
        });
    } finally {
        localStorage.removeItem('pastMembers');
    }
}



function toastProjects() {
    let toastEl = document.getElementById("settingsToast");

    let myToast = bootstrap.Toast.getOrCreateInstance(toastEl, {
        delay: 3000
    });

    let btn = document.querySelector("button #createProjectsBtn");
    toastEl.querySelector(".toast-body").textContent = "Created sample projects.";
    myToast.show();
}

function toastMembers() {
    let toastEl = document.getElementById("settingsToast");

    let myToast = bootstrap.Toast.getOrCreateInstance(toastEl, {
        delay: 3000
    });

    let btn = document.querySelector("button #createPastMembersBtn");
    toastEl.querySelector(".toast-body").textContent = "Created sample past members.";
    myToast.show();
}
