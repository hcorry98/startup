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
    return "/images/icons/" + icon + ".svg#" + icon;
}

function SetIcon() {
    document.querySelector('#icon-select svg use').setAttribute('href', ParseSvgPath());
}

function InitialLoadPastMembers() {
    let pastMembers = LoadPastMembers();
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

function LoadPastMembers() {
    let pastMembers = [];
    const pastMembersText = localStorage.getItem('pastMembers');
    if (pastMembersText) {
        pastMembers = JSON.parse(pastMembersText);
    }
    return pastMembers;
}

function AddPastMember(memberName) {
    let pastMembers = LoadPastMembers();
    pastMembers.push(memberName);
    localStorage.setItem('pastMembers', JSON.stringify(pastMembers));
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

function InviteMember() {
    const email = document.querySelector("#inviteEmail").value;
    if (email === '' || !IsValidEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    AddPastMember(email + " (Pending...)");
    AddMember(email + " (Pending...)");
}

function IsValidEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true);
  }
    return (false);
}

function ClearNewMemberFields() {
    document.querySelector("#inviteEmail").value = '';
    document.querySelector(".member-form select").value = 'default';
}

function CreateProject() {
    let projects = {};
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects = JSON.parse(projectsText);
    }

    newProjectName = document.querySelector('#projectName').value;
    projects[newProjectName] = {'icon': icon,'team-members': GetProjectMembers(), 'tasks': [], 'creating': true};
    console.log(projects);
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

InitialLoadPastMembers();


