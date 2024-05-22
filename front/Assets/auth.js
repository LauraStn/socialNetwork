const signInBtn = document.querySelector(".signInBtn");
const registerMsg = document.querySelector(".registerMsg");

const logBtn = document.querySelector(".logBtn");
const loginMsg = document.querySelector(".loginMsg");

const profil = document.querySelector(".profil");

async function register() {
  const first_name = document.querySelector("#first_nameR").value;
  const last_name = document.querySelector("#last_nameR").value;
  const image = document.querySelector("#image").files[0];
  const email = document.querySelector("#emailR").value;
  const password = document.querySelector("#passwordR").value;

  let formData = new FormData();

  formData.append("first_name", first_name);
  formData.append("last_name", last_name);
  formData.append("image", image);
  formData.append("email", email);
  formData.append("password", password);

  const request = {
    method: "POST",
    body: formData,
  };

  const apiRequest = await fetch(
    "http://localhost:2200/user/register",
    request
  );

  const result = await apiRequest.json();

  if (apiRequest.status === 201) {
    window.alert(
      "Registration successful, email sent with link to activate your account"
    );
    window.location.href = "./login.html";
  } else {
    registerMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-500 font-bold">Wrong credentials !</p>`;
    return;
  }
}

if (signInBtn) {
  signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    register();
  });
}

async function login() {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;

  let user = {
    email: email,
    password: password,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };
  let apiRequest = await fetch("http://localhost:2200/user/login", request);
  let result = await apiRequest.json();

  if (apiRequest.status !== 200) {
    loginMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-500 font-bold">Invalid credentials or account not actived</p>`;
    return;
  } else {
    const data = await result;
    window.localStorage.setItem("token", data.jwt);
    window.localStorage.setItem("role_id", data.role_id);

    loginMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-green-500 font-bold">Login successful,<br>
      redirect...</p>`;
    if (data.role_id === 1) {
      setTimeout(() => {
        window.location.href = "../../Views/admin/adminDashboard.html";
      }, "3000");
      return;
    } else {
      setTimeout(() => {
        window.location.href = "./index.html";
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
  const getAll = await fetch(`http://localhost:2200/user/one`, request);
  const [result] = await getAll.json();
  console.log(result);
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
        <path
          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        ></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      Los Angeles, California
    </div>
  </div>
  <div class="flex justify-center items-center gap-2 my-3">
    
    <div class="font-semibold text-center mx-4">
      <p class="text-black">102</p>
      <span class="text-gray-400">Followers</span>
    </div>
    <div class="font-semibold text-center mx-4">
      <p class="text-black">102</p>
      <span class="text-gray-400">Folowing</span>
    </div>
  </div>`;
}
if (profil) {
  getOneUser();
}
