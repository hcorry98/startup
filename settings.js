function createProjects() {
    let projects = {};
    let name = '';
    let icon = '';
    let teamMembers = [];
    let tasks = {};

    name = "Technical Instructions";
    icon = "pencil";
    teamMembers = ["me", "Sarah", "Madison", "Luke"]
    tasks = [
        ["Take pictures", "Sarah", false],
        ["Take minutes", "Luke", true],
        ["Edit minutes", "me", true],
        ["Bring supplies", "Sarah", false],
        ["Assign tasks", "Madison", false],
        ["Write instructions", "me", false]
    ]

    projects[name] = {'icon': icon, 'team-members': teamMembers, 'tasks': tasks, 'creating': false};

    name = "DnD";
    icon = "notebook";
    teamMembers = ["me", "Jake", "Thomas", "Brock"]
    tasks = [
        ["Print minis", "me", false],
        ["Write campaign", "Brock", true],
        ["Buy fancy dice", "Jake", true],
        ["Buy fancy dice", "Thomas", true],
        ["Obtain Manzanita", "Jake", true],
        ["Drive", "Thomas", true]
    ]

    projects[name] = {'icon': icon, 'team-members': teamMembers, 'tasks': tasks, 'creating': false};

    name = "Delligator";
    icon = "device-laptop";
    teamMembers = ["me"]
    tasks = [
        ["Implement JavaScript", "me", false],
        ["Buy domain name", "me", true],
        ["Setup web server", "me", true],
        ["Implement HTML", "me", true],
        ["Implement CSS", "me", true]
    ]

    projects[name] = {'icon': icon, 'teamMembers': teamMembers, 'tasks': tasks, 'creating': false};

    console.log(projects);
    localStorage.setItem('projects', JSON.stringify(projects));
}

function deleteProjects() {
    let wantToDelete = confirm("Are you sure you want to delete all existing projects?");
    if (!wantToDelete) {
        return false;
    }
    localStorage.removeItem('projects');
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
