function toastUpdate() {
    let toastEl = document.getElementById("updateToast");

    let myToast = bootstrap.Toast.getOrCreateInstance(toastEl, {
        delay: 3000
    });

    toastEl.querySelector(".toast-body").textContent = "'Team Member' just completed 'Task' on 'Project'";
    myToast.show();
}

setTimeout(function () {
    toastUpdate();
}, 10000);