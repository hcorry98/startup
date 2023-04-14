let curUser = '';

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

    curUser = localStorage.getItem('username') ?? 'public';

    name = "Technical Instructions Paper";
    icon = "pencil";
    teamMembers = ["Me", "Sarah", "Madison", "Luke"];
    tasks['Take pictures'] = {'assigned-to': 'Sarah', 'completed': false};
    tasks['Take minutes'] = {'assigned-to': 'Luke', 'completed': true};
    tasks['Edit minutes'] = {'assigned-to': 'Me', 'completed': true};
    tasks['Bring supplies'] = {'assigned-to': 'Sarah', 'completed': false};
    tasks['Assign tasks'] = {'assigned-to': 'Madison', 'completed': false};
    tasks['Write instructions'] = {'assigned-to': 'Me', 'completed': false};

    project = {'user': curUser, 'project-name': name, 'icon': icon, 'team-members': teamMembers, 'tasks': tasks};
    saveProject(project);

    name = "Data Finder";
    icon = "briefcase";
    teamMembers = ["Me", "Jonah", "Cassidy", "Jaden"];
    tasks = {};
    tasks['Draw UML'] = {'assigned-to': 'Me', 'completed': false};
    tasks['Add threading to functions'] = {'assigned-to': 'Cassidy', 'completed': true};
    tasks['Write documentation'] = {'assigned-to': 'Jonah', 'completed': true};
    tasks['Design API'] = {'assigned-to': 'Jonah', 'completed': true};
    tasks['Fix script'] = {'assigned-to': 'Jaden', 'completed': true};

    project = {'user': curUser, 'project-name': name, 'icon': icon, 'team-members': teamMembers, 'tasks': tasks};
    saveProject(project);

    name = "Delligator";
    icon = "device-laptop";
    teamMembers = ["Me"];
    tasks = {};
    tasks['Implement JavaScript'] = {'assigned-to': 'Me', 'completed': false};
    tasks['Buy domain name'] = {'assigned-to': 'Me', 'completed': true};
    tasks['Setup web server'] = {'assigned-to': 'Me', 'completed': true};
    tasks['Implement HTML'] = {'assigned-to': 'Me', 'completed': true};
    tasks['Implement CSS'] = {'assigned-to': 'Me', 'completed': true};

    project =  {'user': curUser, 'project-name': name, 'icon': icon, 'team-members': teamMembers, 'tasks': tasks};
    saveProject(project);
}

async function saveProject(project) {
    try {
        const response = await fetch(`/api/project/${curUser}`, {
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
    curUser = localStorage.getItem('username') ?? 'public';
    let wantToDelete = confirm("Are you sure you want to delete all existing projects?");
    if (!wantToDelete) {
        return false;
    }
    try {
        await fetch(`/api/projects/${curUser}`, {
            method: 'DELETE'
        });
    } finally {
        localStorage.removeItem('projects');
    }
}



async function createPastMembers() {
    curUser = localStorage.getItem('username') ?? 'public';
    const pastMembers = [
        'Jake',
        'Thomas',
        'Brock',
        'Sarah',
        'Luke',
        'Madison',
        'Hailey',
        'Jonathan',
        'Sterling',
        'Jonah',
        'Cassidy',
        'Jaden'
    ]

    const pastMemberList = {'user': curUser, 'members': pastMembers}

    try {
        await fetch(`/api/members/${curUser}`, {
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
    curUser = localStorage.getItem('username') ?? 'public';
    try {
        await fetch(`api/members/${curUser}`, {
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
