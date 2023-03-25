let project;
let projName;

function getProject() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    projName = urlParams.get('project');
    let projects = {};
    const projectText = localStorage.getItem('projects');
    if (projectText) {
        projects = JSON.parse(projectText);
    }
    return projects[projName];
}

function parseIconPath(icon) {
    return '/images/icons/' + icon + '.svg#' + icon;
}

function loadProject() {
    const proj = getProject();
    project = proj;

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
        memberEl.querySelector('label').textContent = member;
        membersDiv.insertBefore(memberEl, buttonDiv);
    }
}

function removeMember(svgEl) {
    const div = svgEl.parentElement;
    const memberToRemove = div.querySelector('label').textContent;
    div.remove();

    let selectBox = document.querySelector(".member-form select");
    const newOption = document.createElement("option");
    newOption.textContent = memberToRemove;
    selectBox.appendChild(newOption);

    const members = project['team-members'];
    const index = members.indexOf(memberToRemove);
    if (index > -1) {
        members.splice(index, 1);
    }
    project['team-members'] = members;

    document.querySelector('.subtitle a').setAttribute('href', 'manage-tasks.html?project=' + projName);

    const tasks = project['tasks'];
    for (let [taskName, task] of Object.entries(tasks)) {
        if (task['assigned-to'] === memberToRemove) {
            task['assigned-to'] = 'Unassigned'
        }
    }
}

function addMember(name) {
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
    const buttonDiv = membersEl.querySelector('button').parentElement;

    const template = document.querySelector('#memberTmpl');
    let newMember = template.content.cloneNode(true);
    newMember.querySelector('label').textContent = name;

    membersEl.insertBefore(newMember, buttonDiv);

    const members = project['team-members'];
    members.push(name);
    project['team-members'] = members;
    document.querySelector('.subtitle a').setAttribute('href', 'manage-tasks.html?project=' + projName);

    const inviteModalEl = document.querySelector('#inviteModal');
    const inviteModal = bootstrap.Modal.getInstance(inviteModalEl);
    inviteModal.hide();
}

function inviteMember() {
    const email = document.querySelector("#inviteEmail").value;
    if (email === '' || !isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    addPastMember(email + " (Pending...)");
    addMember(email + " (Pending...)");
}

function addPastMember(memberName) {
    let pastMembers = LoadPastMembers();
    pastMembers.push(memberName);
    localStorage.setItem('pastMembers', JSON.stringify(pastMembers));
}

function isValidEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true);
  }
    return (false);
}

function initialLoadPastMembers() {
    let pastMembers = loadPastMembers();
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
            newOption.textContent = member;
            selectBox.appendChild(newOption);
        }
    }
}

function loadPastMembers() {
    let pastMembers = [];
    const pastMembersText = localStorage.getItem('pastMembers');
    if (pastMembersText) {
        pastMembers = JSON.parse(pastMembersText);
    }
    return pastMembers;
}

function saveTeam() {
    let projects = {};
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects = JSON.parse(projectsText);
    }
    projects[projName] = project;
    localStorage.setItem('projects', JSON.stringify(projects));
}

loadProject();