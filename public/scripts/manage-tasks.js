let project;
let projName;
let numTasks = 0;

async function getProject() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    projName = urlParams.get('project');

    const curUser = localStorage.getItem('username') ?? 'public';

    try {
        const response = await fetch(`/api/project/${curUser}/${projName}`);
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

async function loadProject() {
    await getProject();

    document.querySelector('.project-name').textContent = projName;

    const icon = project['icon'];
    document.querySelector('.project-icon use').setAttribute('href', parseIconPath(icon));

    document.querySelector('.subtitle a').setAttribute('href', 'project.html?project=' + projName);

    loadTasks();
    if (numTasks === 0) {
        addTask();
    }
}

function loadTasks() {
    const projTasks = project['tasks'];
    const tableEl = document.querySelector('#task-table tbody');
    const template = document.querySelector('#newTaskTmpl');
    const teamMembers = project['team-members'];
    

    for (const [taskName, task] of Object.entries(projTasks)) {
        const nextTask = template.content.cloneNode(true);
        const selectEl = nextTask.querySelector('select');
        for (member of teamMembers) {
            const optionEl = document.createElement('option');
            optionEl.textContent = member;
            optionEl.value = member;
            selectEl.appendChild(optionEl);
        }
        const optionEl = document.createElement('option');
        optionEl.textContent = 'Unassigned';
        optionEl.value = 'Unassigned';
        selectEl.appendChild(optionEl);
        selectEl.value = task['assigned-to'];

        const taskInput = nextTask.querySelector('input');
        taskInput.value = taskName;

        tableEl.appendChild(nextTask);
        numTasks++;
    }
}

function addTask() {
    const tableEl = document.querySelector('#task-table tbody');
    const template = document.querySelector('#newTaskTmpl');
    let newTask = template.content.cloneNode(true);

    if (numTasks === 0) {
        const useEl = newTask.querySelector("svg use");
        useEl.setAttribute('href', '');
    } else if (numTasks === 1) {
        const useEl = document.querySelectorAll('#task-table use')[1];
        useEl.setAttribute('href', 'images/circle-minus.svg#circle-minus');
    }

    const teamMembers = project['team-members']
    const selectEl = newTask.querySelector('select');
    for (member of teamMembers) {
        const optionEl = document.createElement('option');
        optionEl.textContent = member;
        optionEl.value = member;
        selectEl.appendChild(optionEl);
    }
    const optionEl = document.createElement('option');
    optionEl.textContent = 'Unassigned';
    optionEl.value = 'Unassigned';
    selectEl.appendChild(optionEl);
    tableEl.appendChild(newTask);
    numTasks++;
}

function removeTask(el) {
    const rowEl = el.parentElement.parentElement;
    rowEl.remove();
    numTasks--;

    if (numTasks === 1) {
        const useEl = document.querySelectorAll('#task-table use')[1];
        useEl.setAttribute('href', '');
    }
}

function saveTasks() {
    const newTasks = getNewTasks();
    const tasks = {};
    for (const [taskName, task] of Object.entries(newTasks)) {
        tasks[taskName] = task;
    }
    project['tasks'] = tasks;
    console.log(tasks);
    console.log(project);

    saveProject(project);
}

async function saveProject(project) {
    const curUser = localStorage.getItem('username') ?? 'public';
    try {
        const response = await fetch(`/api/project/${curUser}/${project['project-name']}`, {
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
    let projects = {};
    const projectsText = localStorage.getItem('projects');
    if (projectsText) {
        projects.JSON.parse(projectsText);
    }

    projects[project['name']] = project;

    localStorage.setItem('projects', JSON.stringify(projects));
}

function getNewTasks() {
    let newTasks = {};
    const newTasksEls = document.querySelectorAll('#task-table tbody tr');
    const projTasks = project['tasks'];
    for (let taskEl of newTasksEls) {
        const newTaskName = taskEl.querySelector('input').value;
        if (newTaskName === '') {
            continue;
        }
        const memberSelectEl = taskEl.querySelector('select');
        let assignedTo = 'Unassigned';
        if (memberSelectEl.selectedIndex != 0) {
            assignedTo = memberSelectEl.options[memberSelectEl.selectedIndex].textContent;
        }
        let completion = false;
        if (newTaskName in projTasks) {
            completion = projTasks[newTaskName]['completed'];
        }
        newTasks[newTaskName] = {'assigned-to': assignedTo, 'completed': completion};
    }
    console.log(newTasks);
    return newTasks;
}

function parseIconPath(icon) {
    return 'assets/images/icons/' + icon + '.svg#' + icon;
}

loadProject();

