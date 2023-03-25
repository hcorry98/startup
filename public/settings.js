function createProjects() {
    let project;
    let name = '';
    let icon = '';
    let teamMembers = [];
    let tasks = {};

    const curUser = localStorage.getItem('userName') ?? 'Mystery User';

    name = "Technical Instructions";
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

    name = "DnD";
    icon = "notebook";
    teamMembers = ["Me", "Jake", "Thomas", "Brock"];
    tasks = {};
    tasks['Print minis'] = {'assigned-to': 'Me', 'completed': false};
    tasks['Write campaign'] = {'assigned-to': 'Brock', 'completed': true};
    tasks['Buy fancy dice'] = {'assigned-to': 'Jake', 'completed': true};
    tasks['Obtain Manzanita'] = {'assigned-to': 'Jake', 'completed': true};
    tasks['Drive'] = {'assigned-to': 'Thomas', 'completed': true};

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

    project =  {'user': curUser, 'project-name': name, 'icon': icon, 'teamMembers': teamMembers, 'tasks': tasks};
    saveProject(project);
}

async function saveProject(project) {
    try {
        const response = await fetch('/api/project', {
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
    let wantToDelete = confirm("Are you sure you want to delete all existing projects?");
    if (!wantToDelete) {
        return false;
    }
    try {
        await fetch('/api/projects', {
            method: 'DELETE'
        });
    } finally {
        localStorage.removeItem('projects');
    }
}



function createPastMembers() {
    const pastMembers = [
        'Jake',
        'Thomas',
        'Brock',
        'Sarah',
        'Luke',
        'Madison',
        'Hailey',
        'Jonathan',
        'Sterling'
    ]
    console.log(pastMembers);
    localStorage.setItem('pastMembers', JSON.stringify(pastMembers));
}

function deletePastMembers() {
    let wantToDelete = confirm("Are you sure you want to delete all past team members?");
    if (!wantToDelete) {
        return false;
    }
    localStorage.removeItem('pastMembers');
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
