let icon;

function ChooseIcon(element) {
    icon = ParseIconPath(element.src);
}

function ParseIconPath(path) {
    const pathParts = path.split('/');
    const iconName = pathParts[pathParts.length - 1];
    return iconName.split('.')[0];
}

function ParseSvgPath() {
    return "assets/images/icons/" + icon + ".svg#" + icon;
}

function SetIcon() {
    document.querySelector('#icon-select svg use').setAttribute('href', ParseSvgPath());
}

async function InitialLoadPastMembers() {
    let pastMembers = await loadPastMembers();
    let selectBox = document.querySelector(".member-form select");
    for (option of selectBox.options) {
        if (option.value != 'default') {
            option.remove();
        }
    }
    for (member of pastMembers) {
        newOption = document.createElement("option");
        newOption.textContent = member;
        selectBox.appendChild(newOption);
    }
}

async function loadPastMembers() {
    let pastMembers = [];
    const curUser = localStorage.getItem('userName') ?? 'public';

    try {
        const response = await fetch(`/api/members/${curUser}`);
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

async function addPastMember(memberName) {
    const curUser = localStorage.getItem('userName') ?? 'public';

    try {
        const response = await fetch(`/api/members/${curUser}/${memberName}`, {
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
        pastMembers.push(memberName);
        localStorage.setItem('pastMembers', JSON.stringify(pastMembers));
    }

    InitialLoadPastMembers();
}

function RemoveMember(member) {
    const memberRow = member.parentElement;
    const name = memberRow.querySelector("label").textContent;
    memberRow.remove();
    let selectBox = document.querySelector(".member-form select");
    const newOption = document.createElement("option");
    newOption.textContent = name;
    selectBox.appendChild(newOption);
}

function AddMember(name) {
    let selectBox = document.querySelector(".member-form select");
    const defaultChoice = 'Choose team member...';
    if (name == undefined && selectBox.options[selectBox.selectedIndex].value === 'default') {
        return false;
    }
    if (name === undefined) {
        let selectedValue = selectBox.options[selectBox.selectedIndex].textContent;
        name = selectedValue;
        selectBox.options[selectBox.selectedIndex].remove();
        selectBox.selectedIndex = 0;
    }

    let membersEl = document.querySelector('.members');
    const addMemberBtn = membersEl.querySelector('button').parentElement;

    const template = document.querySelector('#memberTmpl');
    let newMember = template.content.cloneNode(true);
    newMember.querySelector('label').textContent = name;

    membersEl.insertBefore(newMember, addMemberBtn);

    const inviteModalEl = document.querySelector('#inviteModal');
    const inviteModal = bootstrap.Modal.getInstance(inviteModalEl);
    inviteModal.hide();
}

async function InviteMember() {
    const username = document.querySelector("#inviteUsername").value;
    if (username === '') {
        alert('Please enter a valid email address.');
        return false;
    }
    await addPastMember(username);
}

function validateProjectName() {
    if (IsValidProjectName()) {
        let newHref = "manage-tasks.html?project=" + newProjectName;
        document.querySelector(".subtitle a").setAttribute('href', newHref);
        enableCreate();
    } else {
        disableCreate();
    }
}

async function IsValidProjectName() {
    newProjectName = document.querySelector('#projectName').value;
    if (newProjectName === '') {
        return false;
    }

    if (await projExists(newProjectName)) {
        nameAlreadyExists();
        console.log("exists");
        return false;
    } else {
        nameDoesNotExist();
        return true;
    }
}

async function projExists(projName) {
    const curUser = localStorage.getItem('userName') ?? 'public';
    try {
        const response = await fetch(`/api/project/${curUser}/${projName}`);
        project = await response.json();
        if (project == null) {
            return false;
        } else {
            return true;
        }
    } catch {
        projects = [];
        const projectsText = localStorage.getItem('projects');
        if (projectsText) {
            projects = JSON.parse(projectsText);
        }
        for (proj of projects) {
            if (proj['project-name'] === projName) {
                return true;
            }
        }
        return false;
    }
}

function disableCreate() {
    document.querySelector('.subtitle a').disabled = true;
    document.querySelector('.subtitle a').style = "opacity: 0.65; pointer-events: none;";
}

function enableCreate() {
    document.querySelector('.subtitle a').removeAttribute('disabled');
    document.querySelector('.subtitle a').removeAttribute('style');
}

function nameAlreadyExists() {
    inputEl = document.querySelector('#projectName');
    inputEl.style['boxShadow'] = '0 0 0 0.25rem rgba(255,0,0,.375)';
    errorLabelEl = document.querySelector('#errorLabel label');
    errorLabelEl.textContent = 'A project with that name already exists';
}

function nameDoesNotExist() {
    inputEl = document.querySelector('#projectName');
    inputEl.removeAttribute('style');
    errorLabelEl = document.querySelector('#errorLabel label');
    errorLabelEl.textContent = '';
}

function ClearNewMemberFields() {
    document.querySelector("#inviteUsername").value = '';
    document.querySelector(".member-form select").value = 'default';
}

function CreateProject() {
    const newProjectName = document.querySelector('#projectName').value;

    const curUser = localStorage.getItem('userName') ?? 'public';

    const newProject = {'user': curUser, 'project-name': newProjectName, 'icon': icon,'team-members': GetProjectMembers(), 'tasks': []};
    console.log(projects);
    saveProject(newProject)
}

async function saveProject(project) {
    const curUser = localStorage.getItem('userName') ?? 'public';
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
    let projects = [];
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects.JSON.parse(projectsText);
    }

    projects.push(newProject);

    localStorage.setItem('projects', JSON.stringify(projects));
}

function GetProjectMembers() {
    let members = [];
    memberLabels = document.querySelector('.members').getElementsByTagName('label');
    for (member of memberLabels) {
        members.push(member.textContent);
    }
    return members;
}

disableCreate();
InitialLoadPastMembers();




