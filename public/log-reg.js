function login() {
    const usernameEl = document.querySelector("#username");
    let username = usernameEl.value
    if (username === '') {
        username = 'public'
    }
    localStorage.setItem("userName", username);
    localStorage.setItem("justLoggedIn", "true");
}