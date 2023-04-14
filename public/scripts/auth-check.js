async function restrictAccess() {
    const username = localStorage.getItem("username") ?? null;

    if (username === null) {
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