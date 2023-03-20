function login() {
    const usernameEl = document.querySelector("#username");
    localStorage.setItem("userName", usernameEl.value);
    localStorage.setItem("justLoggedIn", "true");
}