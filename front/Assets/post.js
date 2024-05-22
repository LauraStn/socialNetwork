const postBtn = document.querySelector(".postBtn");
const postMsg = document.querySelector(".postMsg");
const userPosts = document.querySelector(".userPosts");
const following = document.querySelector(".following");

async function addPost() {
  const jwt = localStorage.getItem("token");

  const content = document.querySelector("#content").value;
  const image = document.querySelector("#image").files[0];

  let formData = new FormData();

  formData.append("content", content);
  formData.append("image", image);

  const request = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  };

  const apiRequest = await fetch("http://localhost:2200/post/add", request);

  const result = await apiRequest.json();

  if (apiRequest.status === 201) {
    window.alert("addpost");
    // window.location.reload();
  } else {
    postMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-500 font-bold">Wrong credentials !</p>`;
    return;
  }
}
if (postBtn) {
  postBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addPost();
  });
}

async function getMyPosts() {
  const jwt = localStorage.getItem("token");

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  let getAll = await fetch(`http://localhost:2200/post/mine`, request);
  let result = await getAll.json();

  result.forEach((element) => {
    let comments = "";

    for (let i = 0; i < element.comments.length; i++) {
      const commentFirstName = element.comments[i].first_name;
      const commentLastName = element.comments[i].last_name;
      const commentUserImage = element.comments[i].user_image;
      const commentContent = element.comments[i].content;
      const commentDate = element.comments[i].created_at;
      comments += `<div class="flex items-center space-x-2 mt-2">
        <img src="http://localhost:2200/uploads/${commentUserImage}" alt="User Avatar" class="w-6 h-6 rounded-full">
        <div>
          <p class="text-gray-800 font-semibold"> ${commentFirstName} ${commentLastName} </p>
          <p class="text-gray-500 text-sm">${commentContent}</p>
        </div>
        </div>`;
    }
    userPosts.innerHTML += `<div class="bg-gray-100 h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md">
      <!-- User Info with Three-Dot Menu -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <img src="http://localhost:2200/uploads/${
            element.user_image
          }" alt="User Avatar" class="w-8 h-8 rounded-full">
          <div>
            <p class="text-gray-800 font-semibold">${element.first_name} ${
      element.last_name
    }</p>
            <p class="text-gray-500 text-sm">${new Date(
              element.created_at
            ).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>
        <div class="text-gray-500 cursor-pointer">
          <!-- Three-dot menu icon -->
          <button class="hover:bg-gray-50 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="7" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="17" r="1" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Message -->
      <div class="mb-4">
        <p class="text-gray-800">${element.content}
        </p>
      </div>
      <!-- Image -->
      <div class="mb-4">
        <img src="http://localhost:2200/uploads/${
          element.image
        }" alt="Post Image" class="w-full h-48 object-cover rounded-md">
      </div>
      <!-- Like and Comment Section -->
      <div class="flex items-center justify-between text-gray-500">
        <div class="flex items-center space-x-2">
          <button class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
            <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>${element.like.length} Likes</span>
          </button>
        </div>
        <button class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
          <svg width="22px" height="22px" viewBox="0 0 24 24" class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"></path>
            </g>
          </svg>
          <span>${element.comments.length} Comments</span>
        </button>
      </div>
      <hr class="mt-2 mb-2">
      <p class="text-gray-800 font-semibold">Comments</p>
      <hr class="mt-2 mb-2">
      <div class="mt-4">${comments}
      </div>
    </div>
  </div>`;
  });
}

if (userPosts) {
  getMyPosts();
}

async function getMyFollower() {
  const jwt = localStorage.getItem("token");

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  let getAll = await fetch(`http://localhost:2200/user/allfollower`, request);
  let result = await getAll.json();

  result.forEach((element) => {
    following.innerHTML += `<li class="flex flex-col items-center space-y-2">
    <a class="block bg-white p-1 rounded-full" href="#">
      <img
        class="w-16 rounded-full"
        src="http://localhost:2200/uploads/${element.image}"
      />
    </a>
    <span class="text-xs text-gray-500"> ${element.first_name} ${element.last_name} </span>
  </li>`;
  });
}

if (following) {
  getMyFollower();
}
