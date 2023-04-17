let project;
let projName;

async function getProject() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    projName = urlParams.get('project');

    curUserText = localStorage.getItem('user');
    curUser = JSON.parse(curUserText);

    try {
        const response = await fetch(`/api/project/${curUser.username}/${projName}`);
        project = await response.json();
    } catch {
        let projects;
        const projectsText = localStorage.getItem('projects');
        if (projectsText) {
            projects = JSON.parse(projectsText);
        }
        for (proj of projects) {
            if (proj['project-name'] === projName) {
                project = proj
                break;
            }
        }
    }
    delete project._id;
}

function parseIconPath(icon) {
    return 'assets/images/icons/' + icon + '.svg#' + icon;
}

async function loadProject() {
    await getProject();

    document.querySelector('.project-name').textContent = projName;

    const icon = project['icon'];
    document.querySelector('.project-icon use').setAttribute('href', parseIconPath(icon));

    document.querySelector('.subtitle a').setAttribute('href', 'project.html?project=' + projName);

    initialLoadPastMembers();
    loadMembers();
}

function loadMembers() {
    const membersDiv = document.querySelector('.members');
    const buttonDiv = membersDiv.querySelector('button').parentElement;
    const teamMembers = project['team-members'];
    const template = document.querySelector('#memberTmpl');
    for (const member of teamMembers) {
        let memberEl = template.content.cloneNode(true);
        if (member.username === curUser.username) {
            continue;
        } else {
            memberEl.querySelector('label').textContent = member.firstName;
        }
        membersDiv.insertBefore(memberEl, buttonDiv);
    }
}

function removeMember(svgEl) {
    const div = svgEl.parentElement;
    let memberToRemove = div.querySelector('label').textContent;
    div.remove();

    let selectBox = document.querySelector(".member-form select");
    const newOption = document.createElement("option");
    newOption.textContent = memberToRemove;
    selectBox.appendChild(newOption);

    const members = project['team-members'];
    console.log(memberToRemove);

    for (let i = 0; i < members.length; i++) {
        if (members[i].firstName === memberToRemove) {
            members.splice(i, 1);
        }
    }

    console.log(members);

    project['team-members'] = members;

    document.querySelector('.subtitle a').setAttribute('href', 'manage-tasks.html?project=' + projName);

    const tasks = project['tasks'];
    for (let [taskName, task] of Object.entries(tasks)) {
        if (task['assigned-to'] === memberToRemove) {
            task['assigned-to'] = 'Unassigned'
        }
    }
}

async function addMember() {
    let selectBox = document.querySelector(".member-form select");
    const defaultChoice = 'Choose team member...';
    if (selectBox.options[selectBox.selectedIndex].value === 'default') {
        return false;
    }

    let selectedValue = selectBox.options[selectBox.selectedIndex].textContent;
    memberFullName = selectedValue;
    selectBox.options[selectBox.selectedIndex].remove();
    selectBox.selectedIndex = 0;

    let pastMembers = await loadPastMembers();
    let member = {}
    for (pastMem of pastMembers) {
        if (pastMem.firstName + " " + pastMem.lastName === memberFullName) {
            member = pastMem;
            break;
        }
    }

    let membersEl = document.querySelector('.members');
    const buttonDiv = membersEl.querySelector('button').parentElement;

    const template = document.querySelector('#memberTmpl');
    let newMember = template.content.cloneNode(true);
    newMember.querySelector('label').textContent = member.firstName;

    membersEl.insertBefore(newMember, buttonDiv);

    const members = project['team-members'];
    members.push(member);
    project['team-members'] = members;
    document.querySelector('.subtitle a').setAttribute('href', 'manage-tasks.html?project=' + projName);

    const inviteModalEl = document.querySelector('#inviteModal');
    const inviteModal = bootstrap.Modal.getInstance(inviteModalEl);
    inviteModal.hide();
}

async function inviteMember() {
    const username = document.querySelector("#inviteUsername").value;
    if (username === '') {
        alert('You must enter a username to invite someone to your team.');
        return false;
    }
    await addPastMember(username);
}

async function addPastMember(memberUsername) {
    curUserText = localStorage.getItem('user');
    curUser = JSON.parse(curUserText);
    pastMember = await fetch(`/api/user/${memberUsername}`);

    try {
        const response = await fetch(`/api/members/${curUser.username}/${memberUsername}`, {
            method: 'POST',
            headers: {'content-type': 'json/application'}
        });
        if (response.status == 404) {
            alert("Member not found. Please invite your team member to create an account.");
            return;
        }
        const memberList = await response.json();
        const pastMembers = memberList['members'];
        localStorage.setItem('pastMembers', JSON.stringify(pastMembers));
    } catch {
        let pastMembers = [];
        const pastMembersText = localStorage.getItem('pastMembers');
        if (pastMembersText) {
            pastMembers = JSON.parse(pastMembersText);
        }
        pastMembers.push(pastMember);
        localStorage.setItem('pastMembers', JSON.stringify(pastMembers));
    }

    initialLoadPastMembers();
}

async function initialLoadPastMembers() {
    let pastMembers = await loadPastMembers();
    const teamMembers = project['team-members'];
    let selectBox = document.querySelector(".member-form select");
    for (option of selectBox.options) {
        if (option.value != 'default') {
            option.remove();
        }
    }
    for (member of pastMembers) {
        if (!teamMembers.includes(member)) {
            newOption = document.createElement("option");
            newOption.textContent = member.firstName + " " + member.lastName;
            selectBox.appendChild(newOption);
        }
    }
}

async function loadPastMembers() {
    let pastMembers = [];
    curUserText = localStorage.getItem('user');
    curUser = JSON.parse(curUserText);

    try {
        const response = await fetch(`/api/members/${curUser.username}`);
        memberList = await response.json();
        pastMembers = memberList['members'];
        localStorage.setItem('pastMembers', pastMembers);
    } catch {
        const pastMembersText = localStorage.getItem('pastMembers');
        if (pastMembersText) {
            pastMembers = JSON.parse(pastMembersText);
        }
    }

    return pastMembers;
}

function saveTeam() {
    saveProject(project)
}

async function saveProject(project) {
    curUserText = localStorage.getItem('user');
    curUser = JSON.parse(curUserText);

    try {
        const response = await fetch(`/api/project/${curUser.username}/${project['project-name']}`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(project),
        });

        const projects = await response.json();
        localStorage.setItem('projects', JSON.stringify(projects));
    } catch {
        updateProjectsLocal(project);
    }
}

function updateProjectsLocal(project) {
    let projects = [];
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects.JSON.parse(projectsText);
    }

    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
}

loadProject();
