function createProjects() {
    let projects = {};
    let name = '';
    let icon = '';
    let teamMembers = [];
    let tasks = {};

    name = "Technical Instructions";
    icon = "pencil";
    teamMembers = ["Me", "Sarah", "Madison", "Luke"];
    tasks['Take pictures'] = {'assigned-to': 'Sarah', 'completed': false};
    tasks['Take minutes'] = {'assigned-to': 'Luke', 'completed': true};
    tasks['Edit minutes'] = {'assigned-to': 'Me', 'completed': true};
    tasks['Bring supplies'] = {'assigned-to': 'Sarah', 'completed': false};
    tasks['Assign tasks'] = {'assigned-to': 'Madison', 'completed': false};
    tasks['Write instructions'] = {'assigned-to': 'Me', 'completed': false};

    projects[name] = {'icon': icon, 'team-members': teamMembers, 'tasks': tasks};

    
    name = "DnD";
    icon = "notebook";
    teamMembers = ["Me", "Jake", "Thomas", "Brock"];
    tasks = {};
    tasks['Print minis'] = {'assigned-to': 'Me', 'completed': false};
    tasks['Write campaign'] = {'assigned-to': 'Brock', 'completed': true};
    tasks['Buy fancy dice'] = {'assigned-to': 'Jake', 'completed': true};
    tasks['Buy fancy dice'] = {'assigned-to': 'Thomas', 'completed': true};
    tasks['Obtain Manzanita'] = {'assigned-to': 'Jake', 'completed': true};
    tasks['Drive'] = {'assigned-to': 'Thomas', 'completed': true};

    projects[name] = {'icon': icon, 'team-members': teamMembers, 'tasks': tasks};

    name = "Delligator";
    icon = "device-laptop";
    teamMembers = ["Me"];
    tasks = {};
    tasks['Implement JavaScript'] = {'assigned-to': 'Me', 'completed': false};
    tasks['Buy domain name'] = {'assigned-to': 'Me', 'completed': true};
    tasks['Setup web server'] = {'assigned-to': 'Me', 'completed': true};
    tasks['Implement HTML'] = {'assigned-to': 'Me', 'completed': true};
    tasks['Implement CSS'] = {'assigned-to': 'Me', 'completed': true};

    projects[name] = {'icon': icon, 'teamMembers': teamMembers, 'tasks': tasks};

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
