const registerBtn = document.querySelector(".registerBtn");
const registerMsg = document.querySelector(".registerMsg");
const passwordMsg = document.querySelector(".passwordMsg");
const logBtn = document.querySelector(".logBtn");
const loginMsg = document.querySelector(".loginMsg");
const sendResetBtn = document.querySelector(".sendResetBtn");
const sendResetMsg = document.querySelector(".sendResetMsg");
const updatePasswordBtn = document.querySelector(".updatePasswordBtn");
const updatePasswordMsg = document.querySelector(".updatePasswordMsg");
const profil = document.querySelector(".profil");
const authBtn = document.querySelector(".authBtn");
const userDashboardNav = document.querySelector(".userDashboardNav");
const adminDashboardNav = document.querySelector(".adminDashboardNav");
const logOutBtn = document.querySelector(".logOutBtn");

async function register() {
  const first_name = document.querySelector("#first_nameR").value;
  const last_name = document.querySelector("#last_nameR").value;
  const image = document.querySelector("#image").files[0];
  const email = document.querySelector("#emailR").value;
  const password = document.querySelector("#passwordR").value;
  const confirm_password = document.querySelector("#confirm_passwordR").value;

  let formData = new FormData();

  formData.append("first_name", first_name);
  formData.append("last_name", last_name);
  formData.append("image", image);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("confirm_password", confirm_password);

  const request = {
    method: "POST",
    body: formData,
  };

  const apiRequest = await fetch(
    "http://localhost:2200/user/register",
    request
  );

  const result = await apiRequest.json();
  console.log(result);
  if (result.success) {
    window.alert(
      "Registration successful, email sent with link to activate your account"
    );
    window.location.href = "./login.html";
  } else {
    registerMsg.innerHTML = `<p class="mt-4 text-sm text-red-500 text-center">${result.msg}</p>`;
    return;
  }
}

if (registerBtn) {
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    register();
  });
}

async function login() {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;

  const user = {
    email: email,
    password: password,
  };

  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };
  const apiRequest = await fetch("http://localhost:2200/user/login", request);
  const result = await apiRequest.json();
  console.log(result);
  if (!result.success) {
    loginMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-500">${result.msg}</p>`;
    return;
  } else {
    const data = await result;
    window.localStorage.setItem("token", data.jwt);
    window.localStorage.setItem("role_id", data.role_id);

    loginMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-green-500">Login successful,<br>
      redirect...</p>`;
    if (data.role_id === 1) {
      setTimeout(() => {
        window.location.href = "./admindashboard.html";
      }, "3000");
      return;
    } else {
      setTimeout(() => {
        window.location.href = "./home.html";
      }, "3000");
      return;
    }
  }
}

if (logBtn) {
  logBtn.addEventListener("click", (e) => {
    e.preventDefault();
    login();
  });
}

async function getOneUser() {
  const jwt = localStorage.getItem("token");

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getAll = await fetch(`http://localhost:2200/user/useronline`, request);
  const [result] = await getAll.json();

  let getAllFollowing = await fetch(
    `http://localhost:2200/user/allmyfollowing`,
    request
  );
  let following = await getAllFollowing.json();

  let getAllFollower = await fetch(
    `http://localhost:2200/user/allmyfollower`,
    request
  );
  let follower = await getAllFollower.json();
  profil.innerHTML += `<div class="flex flex-col gap-1 text-center items-center">
    <img
      class="h-32 w-32 bg-white p-2 rounded-full shadow mb-4"
      src="http://localhost:2200/uploads/${result.image}"
      alt=""
    />
    <p class="font-semibold">${result.first_name} ${result.last_name}</p>
    <div
      class="text-sm leading-normal text-gray-400 flex justify-center items-center"
    >
      <svg
        viewBox="0 0 24 24"
        class="mr-1"
        width="16"
        height="16"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
      </svg>
    </div>
  </div>
  <div class="flex justify-center items-center gap-2 my-3">
    
    <div class="font-semibold text-center mx-4">
      <p class="text-black"> ${follower.length} </p>
      <span class="text-gray-400">Followers</span>
    </div>
    <div class="font-semibold text-center mx-4">
      <p class="text-black"> ${following.length} </p>
      <span class="text-gray-400">Folowing</span>
    </div>
  </div>`;
}

if (profil) {
  getOneUser();
}

async function resetPassword() {
  const email = document.querySelector("#sendEmail").value;

  const user = {
    email: email,
  };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };
  console.log(email);
  const apiRequest = await fetch("http://localhost:2200/user/reset", request);
  const result = await apiRequest.json();
  console.log(result);
  if (result.success) {
    sendResetMsg.innerHTML = `<p class="mt-4 text-sm text-green-500 text-center">${result.msg}</p>`;
    setTimeout(() => {
      window.location.href = "./login.html";
    }, "3000");
    return;
  } else {
    sendResetMsg.innerHTML = `<p class="mt-4 text-sm text-red-500 text-center">${result.msg}</p>`;
    return;
  }
}

if (sendResetBtn) {
  sendResetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetPassword();
  });
}

async function updatePassword() {
  const password = document.querySelector("#password").value;
  const confirm_password = document.querySelector("#confirm_password").value;
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const user = {
    password: password,
    confirm_password: confirm_password,
    token: token,
  };
  console.log(params);
  const request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };
  const apiRequest = await fetch(
    `http://localhost:2200/user/changepassword`,
    request
  );
  const result = await apiRequest.json();
  if (result.success) {
    updatePasswordMsg.innerHTML = `<p class="mt-4 text-sm text-green-500 text-center">${result.msg}</p>`;
    setTimeout(() => {
      window.location.href = "./login.html";
    }, "3000");
    return;
  } else {
    updatePasswordMsg.innerHTML = `<p class="mt-4 text-sm text-red-500 text-center">${result.msg}</p>`;
    return;
  }
}

if (updatePasswordBtn) {
  updatePasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    updatePassword();
  });
}

async function validateAccount() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const user = {
    token: token,
  };
  const request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };
  const apiRequest = await fetch(
    `http://localhost:2200/user/validateAccount`,
    request
  );
  if (result.success) {
    console.log("cool");
  }
}

(function isConnected() {
  const jwt = localStorage.getItem("token");
  const role_id = localStorage.getItem("role_id");
  if (jwt !== null) {
    if (authBtn) {
      authBtn.classList.add("hidden");
    }
    if (logOutBtn) {
      logOutBtn.classList.remove("hidden");
    }
    if (role_id === "2") {
      userDashboardNav.classList.remove("hidden");
    } else {
      adminDashboardNav.classList.remove("hidden");
    }
  }
})();

function logout() {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("role_id");
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", (e) => {
    e.preventDefault;
    logout();
    window.alert("Disconnected successfull");
  });
}
