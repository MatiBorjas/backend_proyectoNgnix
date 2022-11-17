const socket = io();

const buttonLogin = document.getElementById("login-btn");
buttonLogin.addEventListener("click", (e) => {
  const user = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
  socket.emit("login", JSON.stringify(user));
});