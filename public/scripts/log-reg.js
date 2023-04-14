async function login() {
    const usernameEl = document.querySelector("#username");
    let username = usernameEl.value;
    if (username === '') {
        username = 'public';
    }

    const passwordEl = document.querySelector("#password");
    let password = passwordEl.value;

    localStorage.setItem("username", username);
    localStorage.setItem("justLoggedIn", "true");

    const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({'username': username, 'password': password})
    });

    if (response.status !== 200) {
        errorMsg = await response.json();
        alert(errorMsg.msg);
    } else {
        window.location.href = "/home.html";
    }
}

async function register() {
    const firstNameEl = document.querySelector('#firstname');
    const lastNameEl = document.querySelector('#lastname');
    const emailEl = document.querySelector('#email');
    const usernameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");
    const passConfirmEl = document.querySelector('#confirmPass');
    let firstName = firstNameEl.value;
    let lastName = lastNameEl.value;
    let email = emailEl.value;
    let username = usernameEl.value;
    let password = passwordEl.value;
    let confirmPass = passConfirmEl.value;

    if (password !== confirmPass) {
        alert('Passwords do not match.');
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("justLoggedIn", "true");

    newUser = {};
    newUser['username'] = username;
    newUser['email'] = email;
    newUser['password'] = password;
    newUser['firstName'] = firstName;
    newUser['lastName'] = lastName;

    const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(newUser)
    });

    if (response.status !== 200) {
        errorMsg = await response.json();
        alert(errorMsg.msg);
    } else {
        window.location.href = "/home.html";
    }
}