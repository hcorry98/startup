async function restrictAccess() {
    const userText = localStorage.getItem("user") ?? null;
    let user = null;
    if (userText) {
        user = JSON.parse(userText);
    } else {
        window.location.href = '/login.html';
        return;
    }
    
    const username = user.username;

    if (user === null) {
        window.location.href = "/login.html";
        return;
    }

    let response = await fetch(`/api/user/${username}`);
    response = await response.json();
    if (!response.authenticated) {
        window.location.href = "/login.html";
        return;
    }
}

restrictAccess();