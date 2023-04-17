let socket;
let curUser;
let projUpdated = false;

function toastUpdate(completed, member, taskName, projectName) {
    let toastEl = document.getElementById("updateToast");

    let myToast = bootstrap.Toast.getOrCreateInstance(toastEl, {
        delay: 7000
    });

    if (completed) {
        toastEl.querySelector("#message").textContent = `${member.firstName} just completed '${taskName}' on `;
        toastEl.querySelector("#proj-name").textContent = `${projectName}`;
    } else {
        toastEl.querySelector("#message").textContent = `${member.firstName} marked '${taskName}' as incomplete on `;
        toastEl.querySelector("#proj-name").textContent = `${projectName}`;
    }
    
    myToast.show();
}

function configureWebSocket() {
    const curUserText = localStorage.getItem('user');
    const curUser = JSON.parse(curUserText);

    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socket.onmessage = async (event) => {
        const msg = JSON.parse(await event.data.text());
        if (msg.teamMembers.some(e => e.username === curUser.username)) {
            toastUpdate(msg.completed, msg.member, msg.taskName, msg.projectName);
            let curPage = window.location.href;
            if (curPage.includes('/home.html') || curPage.includes('/project.html')) {
                projUpdated = true;
            }
        }
    }
}

function broadcastEvent(teamMembers, completed, member, taskName, projectName) {
    const event = {
        teamMembers: teamMembers,
        completed: completed,
        member: member,
        taskName: taskName,
        projectName: projectName
    };
    socket.send(JSON.stringify(event));
}

configureWebSocket();