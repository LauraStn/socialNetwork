const postBtn = document.querySelector(".postBtn");
const postMsg = document.querySelector(".postMsg");
const userPosts = document.querySelector(".userPosts");
const follower = document.querySelector(".follower");
const following = document.querySelector(".following");
const allpost = document.querySelector(".allpost");
const searchResults = document.querySelector(".searchResults");
const displayAllUsers = document.querySelector(".displayAllUsers");
const allUsersAdmin = document.querySelector(".allUsersAdmin");
const userProfil = document.querySelector(".userProfil");
const userFollowing = document.querySelector(".userFollowing");
const userFollower = document.querySelector(".userFollower");
const getUserPosts = document.querySelector(".getUserPosts");

async function addPost() {
  const jwt = localStorage.getItem("token");

  const content = document.querySelector("#content").value;
  const image = document.querySelector("#image").files[0];

  let formData = new FormData();

  formData.append("content", content);
  formData.append("image", image);
  console.log(image);
  const request = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  };

  const apiRequest = await fetch("http://localhost:2200/post/add", request);

  const result = await apiRequest.json();
  if (result.success) {
    window.location.reload();
    postMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-green-600">${result.msg}</p>`;
  } else {
    postMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-500">${result.msg}</p>`;
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
  const getAll = await fetch(`http://localhost:2200/post/mine`, request);
  const result = await getAll.json();

  const getUser = await fetch(`http://localhost:2200/user/useronline`, request);
  const [user] = await getUser.json();

  result.forEach((element) => {
    let comments = "";

    for (let i = 0; i < element.comments.length; i++) {
      const commentFirstName = element.comments[i].first_name;
      const commentLastName = element.comments[i].last_name;
      const commentUserImage = element.comments[i].user_image;
      const commentContent = element.comments[i].content;
      const commentDate = element.comments[i].createdAt;
      comments += `<div class="text-black p-4 antialiased flex">
      <img
        class="rounded-full h-8 w-8 mr-2 mt-1"
        src="http://localhost:2200/uploads/${commentUserImage}"
      />
      <div>
        <div class="bg-gray-100 rounded-lg px-4 pt-2 pb-2.5">
          <div class="font-semibold text-sm leading-relaxed">
            ${commentFirstName} ${commentLastName}
          </div>
          <div class="text-xs leading-snug md:leading-normal">
            ${commentContent}
          </div>
        </div>
        <div class="text-xs mt-0.5 text-gray-500">${new Date(
          commentDate
        ).toLocaleDateString("fr-FR")}</div>
        <div
          class="bg-white border border-white rounded-full float-right -mt-8 mr-0.5 flex shadow items-center"
        >
          
        </div>
      </div>
    </div>`;
    }
    userPosts.innerHTML += `<div class="allpost bg-white shadow rounded-lg mb-6 p-4">
    <div class="flex flex-row px-2 py-3 mx-3">
      <div class="w-auto h-auto rounded-full">
        <img
          class="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
          alt="User avatar"
          src="http://localhost:2200/uploads/${element.user_image}"
        />
      </div>
      <div class="flex flex-col mb-2 ml-4 mt-1">
        <div class="text-gray-600 text-sm font-semibold"> ${
          element.first_name
        } ${element.last_name} </div>
        <div class="flex w-full mt-1">
          
          <div class="text-gray-400 font-thin text-xs">
            • ${new Date(element.created_at).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </div>
      <div class="ml-auto flex flex-col gap-1 cursor-pointer relative w-8 items-center"
      id="menu-${element._id}"
      onclick="displayMenu('${element._id}')"
      >
          <span class="h-1 text-xl">.</span>
          <span class="h-1 text-xl">.</span>
          <span class="h-1 text-xl">.</span>
              <div class="flex flex-col gap-2 absolute py-2 px-3 top-[40px] left-[-30px] bg-white border invisible"
                  id="submenu-${element._id}">
                      <button onclick="displayEdit('${
                        element._id
                      }')">Edit</button>
                      <button class="text-red-400" onclick="deletePost('${
                        element._id
                      }')">Delete
                      </button>
              </div>
      </div>
    </div>
    <div class="border-b border-gray-100"></div>
    <div class="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
              <img class="rounded w-full" src="http://localhost:2200/uploads/${
                element.image
              }" />
            </div>
    <div class="text-gray-500 text-sm mb-6 mx-3 px-2">
      ${element.content}
    </div>
    <div class="flex justify-start mb-4 border-t border-gray-100">
      <div class="flex w-full mt-1 pt-2 pl-5">
       <button class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
       onclick="displayComments('${element._id}')"
       id="commentsBtn-${element._id}">       
        
          <svg
          class="h-4 w-4 text-gray-500"

            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="14px"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" 
            ></path>
          </svg>
        
        </button>
      </div>
      <div class="flex justify-end w-full mt-1 pt-2 pr-5">
      <button class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
      onclick="like('${element._id}')">
      
        <svg
          class="h-4 w-4 text-red-500"
          id="like-${element._id}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
          ></path>
        </svg>
      </button>
        
      </div>
    </div>
    <div class="flex w-full border-t border-gray-100">
      <div class="mt-3 mx-5 flex flex-row text-xs">
        <div
          class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center"
        >
          Comments:
          <div class="ml-1 text-gray-400 text-ms"> ${
            element.comments.length
          } </div>
        </div>
        
      </div>
      <div class="mt-3 mx-5 w-full flex justify-end text-xs">
        <div
          class="flex text-gray-700 rounded-md mb-2 mr-4 items-center"
        >
          Likes:
          <div class="ml-1 text-gray-400 text-ms">${element.like.length}</div>
        </div>
      </div>
    </div>
    <div class="h-2 invisible"
    id="comments-${element._id}">
    ${comments}
    </div>
    <div
      class="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400"
    >
      <img
        class="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
        alt="User avatar"
        src="http://localhost:2200/uploads/${user.image}"
      />
      <span class="absolute inset-y-0 right-0 flex items-center pr-6">
        <button
          onclick="addComment('${element._id}')"
          class="p-1 focus:outline-none focus:shadow-none hover:text-blue-500"
            >
            <svg
            class="ml-1"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </span>
      <input
        type="text"
        id="content-${element._id}"
        class="content w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
        style="border-radius: 25px"
        placeholder="Post a comment..."
        autocomplete="off"
        value=""
      />
    </div>
  </div>`;
    const like = document.querySelector("#like-" + element._id);

    if (element.like.includes(user.user_id)) {
      like.style.fill = "red";
    }
  });
}

if (userPosts) {
  getMyPosts();
}
async function displayMenuNav() {
  const subMenuNav = document.querySelector("#subMenuNav");

  if (subMenuNav.classList.contains("invisible")) {
    subMenuNav.classList.remove("invisible");
    subMenuNav.classList.add("visible");
  } else {
    subMenuNav.classList.remove("visible");
    subMenuNav.classList.add("invisible");
  }
}

async function displayMenu(id) {
  const submenu = document.querySelector("#submenu-" + id);

  if (submenu.classList.contains("invisible")) {
    submenu.classList.remove("invisible");
    submenu.classList.add("visible");
    console.log("visible");
  } else {
    submenu.classList.remove("visible");
    submenu.classList.add("invisible");
  }
}

async function displayComments(id) {
  const showComments = document.querySelector("#comments-" + id);

  if (showComments.classList.contains("invisible")) {
    showComments.classList.remove("invisible");
    showComments.classList.add("visible");
    showComments.classList.remove("h-2");
  } else {
    showComments.classList.remove("visible");
    showComments.classList.add("invisible");
    showComments.classList.add("h-2");
  }
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
  let getAll = await fetch(`http://localhost:2200/user/allmyfollower`, request);
  let result = await getAll.json();

  result.forEach((element) => {
    follower.innerHTML += `<li class="flex flex-col items-center space-y-2">
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

if (follower) {
  getMyFollower();
}

async function getMyFollowing() {
  const jwt = localStorage.getItem("token");

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getAll = await fetch(
    `http://localhost:2200/user/allmyfollowing`,
    request
  );
  const result = await getAll.json();

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
  getMyFollowing();
}

async function getAllPosts() {
  const jwt = localStorage.getItem("token");
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  let getAll = await fetch(`http://localhost:2200/post/getall`, request);
  let result = await getAll.json();
  const getUser = await fetch(`http://localhost:2200/user/useronline`, request);
  const [user] = await getUser.json();

  result.forEach((element) => {
    let comments = "";

    for (let i = 0; i < element.comments.length; i++) {
      const commentFirstName = element.comments[i].first_name;
      const commentLastName = element.comments[i].last_name;
      const commentUserImage = element.comments[i].user_image;
      const commentContent = element.comments[i].content;
      const commentDate = element.comments[i].createdAt;
      comments += `<div class="text-black p-4 antialiased flex">
      <img
        class="rounded-full h-8 w-8 mr-2 mt-1"
        src="http://localhost:2200/uploads/${commentUserImage}"
      />
      <div>
        <div class="bg-gray-100 rounded-lg px-4 pt-2 pb-2.5">
          <div class="font-semibold text-sm leading-relaxed">
            ${commentFirstName} ${commentLastName}
          </div>
          <div class="text-xs leading-snug md:leading-normal">
            ${commentContent}
          </div>
        </div>
        <div class="text-xs mt-0.5 text-gray-500">${new Date(
          commentDate
        ).toLocaleDateString("fr-FR")}</div>
        <div
          class="bg-white border border-white rounded-full float-right -mt-8 mr-0.5 flex shadow items-center"
        >
          
        </div>
      </div>
    </div>`;
    }
    allpost.innerHTML += `<div class="allpost bg-white shadow rounded-lg mb-6 p-4">
    <div class="flex flex-row px-2 py-3 mx-3">
      <div class="w-auto h-auto rounded-full">
        <img
          class="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
          alt="User avatar"
          src="http://localhost:2200/uploads/${element.user_image}"
        />
      </div>
      <div class="flex flex-col mb-2 ml-4 mt-1">
        <div class="text-gray-600 text-sm font-semibold"> ${
          element.first_name
        } ${element.last_name} </div>
        <div class="flex w-full mt-1">
          
          <div class="text-gray-400 font-thin text-xs">
            • ${new Date(element.created_at).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </div>
    </div>
    <div class="border-b border-gray-100"></div>
    <div class="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
              <img class="rounded w-full" src="http://localhost:2200/uploads/${
                element.image
              }" />
            </div>
    <div class="text-gray-500 text-sm mb-6 mx-3 px-2">
      ${element.content}
    </div>
    <div class="flex justify-start mb-4 border-t border-gray-100">
      <div class="flex w-full mt-1 pt-2 pl-5">
    
      <button class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
      onclick="displayComments('${element._id}')"
      id="commentsBtn-${element._id}">       
       
         <svg
         class="h-4 w-4 text-gray-500"

           xmlns="http://www.w3.org/2000/svg"
           fill="none"
           width="14px"
           viewBox="0 0 24 24"
           stroke="currentColor"
         >
           <path
             stroke-linecap="round"
             stroke-linejoin="round"
             stroke-width="2"
             d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" 
           ></path>
         </svg>
       
       </button>
        
      </div>
      <div class="flex justify-end w-full mt-1 pt-2 pr-5">
        
        <button class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
        onclick="like('${element._id}')">
        
          <svg
            class="h-4 w-4 text-red-500"
            id="like-${element._id}"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="flex w-full border-t border-gray-100">
      <div class="mt-3 mx-5 flex flex-row text-xs">
        <div
          class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center"
        >
          Comments:
          <div class="ml-1 text-gray-400 text-ms"> ${
            element.comments.length
          } </div>
        </div>
        
      </div>
      <div class="mt-3 mx-5 w-full flex justify-end text-xs">
        <div
          class="flex text-gray-700 rounded-md mb-2 mr-4 items-center"
        >
          Likes:
          <div class="ml-1 text-gray-400 text-ms">${element.like.length}</div>
        </div>
      </div>
    </div>
    <div class="h-2 invisible"
    id="comments-${element._id}">
    ${comments}
    </div>
    <div
      class="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400"
    >
      <img
        class="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
        alt="User avatar"
        src="http://localhost:2200/uploads/${user.image}"
      />
      <span class="absolute inset-y-0 right-0 flex items-center pr-6">
        <button
          onclick="addComment('${element._id}')"
          class="p-1 focus:outline-none focus:shadow-none hover:text-blue-500"
            >
            <svg
            class="ml-1"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </span>
      <input
        type="text"
        id="content-${element._id}"
        class="content w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
        style="border-radius: 25px"
        placeholder="Post a comment..."
        autocomplete="off"
        value=""
      />
    </div>
  </div>`;
    const like = document.querySelector("#like-" + element._id);

    if (element.like.includes(user.user_id)) {
      like.style.fill = "red";
    }
  });
}

if (allpost) {
  getAllPosts();
}

async function addComment(post_id) {
  const jwt = localStorage.getItem("token");

  const content = document.querySelector("#content-" + post_id).value;

  const newComment = {
    content: content,
  };
  const request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(newComment),
  };

  const apiRequest = await fetch(
    `http://localhost:2200/post/addcomment/${post_id}`,
    request
  );

  const result = await apiRequest.json();
  if (apiRequest.status === 200) {
    window.alert("Comment added");
    window.location.reload();
  } else {
    postMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-500 font-bold">Wrong credentials !</p>`;
    return;
  }
}

async function like(_id) {
  const jwt = localStorage.getItem("token");
  const like = document.querySelector("#like-" + _id);

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getOne = await fetch(
    `http://localhost:2200/post/getone/${_id}`,
    request
  );
  const post = await getOne.json();
  const getUser = await fetch(`http://localhost:2200/user/useronline`, request);
  const [user] = await getUser.json();

  if (post.like.includes(user.user_id)) {
    const request = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${jwt}`,
      },
    };
    const dislikeRequest = await fetch(
      `http://localhost:2200/post/dislike/${_id}`,
      request
    );

    const dislikeresult = await dislikeRequest.json();

    if (dislikeresult.success) {
      like.style.fill = "none";
      getAllPosts();
      return;
    }
  }

  const likerequest = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const likeresult = await fetch(
    `http://localhost:2200/post/like/${_id}`,
    likerequest
  );

  const result = await likeresult.json();

  if (result.success) {
    like.style.fill = "red";
    getAllPosts();
  }
}

async function deletePost(id) {
  const jwt = localStorage.getItem("token");

  const request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const apiRequest = await fetch(
    `http://localhost:2200/post/delete/${id}`,
    request
  );
  const result = await apiRequest.json();
  console.log(result);
  if (result.success) {
    window.alert("Post deleted");
    window.location.reload();
  } else {
    window.alert("Error");
    window.location.reload();
  }
}

async function search() {
  const jwt = localStorage.getItem("token");
  const search = document.querySelector("#search").value;

  const newSearch = {
    search: search,
  };
  const searchRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(newSearch),
  };
  const getSearch = await fetch(
    "http://localhost:2200/user/search",
    searchRequest
  );
  const result = await getSearch.json();

  const userRequest = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getUserOnline = await fetch(
    "http://localhost:2200/user/useronline",
    userRequest
  );
  const user = await getUserOnline.json();
  console.log(user);

  const requestFollowing = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getUserFollowing = await fetch(
    "http://localhost:2200/user/allmyfollowing",
    requestFollowing
  );
  const userFollowing = await getUserFollowing.json();
  searchResults.innerHTML = "";
  result.forEach((element) => {
    searchResults.innerHTML += `<div
    class="w-full max-w-lg py-8 flex flex-row items-center justify-center mx-auto bg-[#FFFBFB] rounded-lg shadow-xl"
  >
    <div
      class="flex flex-col md:flex-row w-3/4 md:w-5/6 space-x-0 md:space-x-8"
    >
      <div
        class="w-full md:w-2/5 flex flex-col items-center justify-center"
      >
        <figure class="w-1/2 md:w-full rounded-full overflow-hidden">
          <img
          src="http://localhost:2200/uploads/${element.image}"
          alt="user image"
        </figure>
      </div>
      <div
        class="w-full md:w-3/5 space-y-4 flex flex-col justify-center items-center"
      >
        <div class="flex flex-col justify-center">
          <h1
            class="text-center md:text-left text-2xl font-bold text-gray-900"
          >
            ${element.first_name} ${element.last_name}
          </h1>
        </div>
        <ul
          class="space-y-4 md:space-y-0 space-x-0 md:space-x-4 flex flex-col md:flex-row text-left justify-center"
        >
          <li class="text-sm">
            <i class="iconoir-calendar mr-2"></i>Member since ${new Date(
              element.created_at
            ).toLocaleDateString("fr-FR")}
          </li>
        </ul>

   
        <button
        id="follow-${element.user_id}"
        onclick="follow(${element.user_id})"
          class="follow w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
        >
          Follow
        </button>
      </div>
    </div>
  </div>`;

    for (let i = 0; i < userFollowing.length; i++) {
      const following_id = userFollowing[i].following_user_id;
      const follow = document.querySelector("#follow-" + element.user_id);
      if (element.user_id === following_id) {
        follow.innerText = "Unfollow";
      }
    }
  });
}

async function follow(id) {
  const jwt = localStorage.getItem("token");

  const verifRequest = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getVerif = await fetch(
    `http://localhost:2200/user/veriffollow/${id}`,
    verifRequest
  );
  const follow = await getVerif.json();
  if (!follow.success) {
    const followRequest = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
    const follow = await fetch(
      `http://localhost:2200/user/follow/${id}`,
      followRequest
    );
    const followResult = await follow.json();
    const followBtn = document.querySelector("#follow-" + id);

    followBtn.innerText = "Unfollow";
    return;
  } else {
    const unfollowRequest = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
    const unfollow = await fetch(
      `http://localhost:2200/user/unfollow/${id}`,
      unfollowRequest
    );
    const unfollowResult = await unfollow.json();
    const followBtn = document.querySelector("#follow-" + id);

    followBtn.innerText = "Follow";
    return;
  }
}

async function getAllUsers() {
  const jwt = localStorage.getItem("token");

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getAll = await fetch("http://localhost:2200/user/getalluser", request);
  const result = await getAll.json();
  console.log(result);
  const requestFollowing = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getUserFollowing = await fetch(
    "http://localhost:2200/user/allmyfollowing",
    requestFollowing
  );
  const userFollowing = await getUserFollowing.json();
  result.forEach((element) => {
    console.log(element);

    displayAllUsers.innerHTML += `<div
    class="w-full max-w-lg py-8 flex flex-row items-center justify-center mx-auto bg-[#FFFBFB] rounded-lg shadow-xl"
  >
    <div
      class="flex flex-col md:flex-row w-3/4 md:w-5/6 space-x-0 md:space-x-8"
    >
      <div
        class="w-full md:w-2/5 flex flex-col items-center justify-center"
      >
      <a href="./profil.html?id=${element.user_id}">
        <figure class="w-1/2 md:w-full rounded-full overflow-hidden">
          <img
          src="http://localhost:2200/uploads/${element.image}"
          alt="user image"
        </figure>
        </a>
      </div>
      <div
        class="w-full md:w-3/5 space-y-4 flex flex-col justify-center items-center"
      >
        <div class="flex flex-col justify-center">
          <h1
            class="text-center md:text-left text-2xl font-bold text-gray-900"
          >
            ${element.first_name} ${element.last_name}
          </h1>
        </div>
        <ul
          class="space-y-4 md:space-y-0 space-x-0 md:space-x-4 flex flex-col md:flex-row text-left justify-center"
        >
          <li class="text-sm">
            <i class="iconoir-calendar mr-2"></i>Member since ${new Date(
              element.created_at
            ).toLocaleDateString("fr-FR")}
          </li>
        </ul>

   
        <button
        id="follow-${element.user_id}"
        onclick="follow(${element.user_id})"
          class="follow w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
        >
          Follow
        </button>
      </div>
    </div>
  </div>`;

    for (let i = 0; i < userFollowing.length; i++) {
      const following_id = userFollowing[i].following_user_id;
      const follow = document.querySelector("#follow-" + element.user_id);
      if (element.user_id === following_id) {
        follow.innerText = "Unfollow";
      }
    }
  });
}

if (displayAllUsers) {
  getAllUsers();
}

async function getAllUsersAdmin() {
  const jwt = localStorage.getItem("token");

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getAll = await fetch("http://localhost:2200/user/getalluser", request);
  const result = await getAll.json();

  result.forEach((element) => {
    const is_active = element.is_active;
    allUsersAdmin.innerHTML += `<div
    class="w-full max-w-lg py-8 flex flex-row items-center justify-center mx-auto bg-[#FFFBFB] rounded-lg shadow-xl"
  >
    <div
      class="flex flex-col md:flex-row w-3/4 md:w-5/6 space-x-0 md:space-x-8"
    >
      <div
        class="w-full md:w-2/5 flex flex-col items-center justify-center"
      >
        <figure class="w-1/2 md:w-full rounded-full overflow-hidden">
          <img
          src="http://localhost:2200/uploads/${element.image}"
          alt="user image"
        </figure>
      </div>
      <div
        class="w-full md:w-3/5 space-y-4 flex flex-col justify-center items-center"
      >
        <div class="flex flex-col justify-center">
          <h1
            class="text-center md:text-left text-2xl font-bold text-gray-900"
          >
            ${element.first_name} ${element.last_name}
          </h1>
        </div>
        <ul
          class="space-y-4 md:space-y-0 space-x-0 md:space-x-4 flex flex-col md:flex-row text-left justify-center"
        >
          <li class="text-sm">
            <i class="iconoir-calendar mr-2"></i>Member since ${new Date(
              element.created_at
            ).toLocaleDateString("fr-FR")}
          </li>
        </ul>
        <button
        id="banUser-${element.user_id}"
        onclick="banUser(${element.user_id})"
          class="w-full bg-red-500 text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
        >
          Ban user
        </button>
      </div>
    </div>
  </div>`;

    const banBtn = document.querySelector("#banUser-" + element.user_id);
    if (is_active === 0) {
      banBtn.innerText = "Inactive account";
    }
  });
}

if (allUsersAdmin) {
  getAllUsersAdmin();
}

async function banUser(id) {
  const jwt = localStorage.getItem("token");

  const request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getAll = await fetch(`http://localhost:2200/user/ban/${id}`, request);
  const result = await getAll.json();

  const banBtn = document.querySelector("#banUser-" + id);

  if (result.affectedRows === 1) {
    banBtn.innerText = "Inactive account";
  }
}

async function displayEdit(id) {
  const jwt = localStorage.getItem("token");

  const displayEditModal = document.querySelector(".displayEditModal");

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const apiRequest = await fetch(
    `http://localhost:2200/post/getone/${id}`,
    request
  );
  const result = await apiRequest.json();

  console.log(result);
  displayEditModal.innerHTML = `<div class="shadow bg-dark/30 rounded-lg p-6 fixed left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 z-50 w-full h-full flex flex-col justify-center items-center bg-slate-600 bg-opacity-70">
  <div class="bg-white py-3 px-5 rounded-lg w-[70%] m-auto"> 
    <h3 class="pb-3">Content</h3>  
    <textarea
      name="message"
      id="contentUpdate"
      placeholder="Type something..."
      rows="5"
      class="w-full rounded-lg p-2 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
    >${result.content}</textarea>
    <h3 class="pb-3">Image</h3>  
    <div class="flex flex-col gap-4">
      <label for="imageUpdate" class="w-2/4 block">
        <div class="flex gap-3 items-center"> 
          <span
            class="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer"
            >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
              >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
              ></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </span>
          <span>Select an image</span> 
          <span id="previewName"></span>
        </div> 
        

        <input type="file" id="imageUpdate" name="imageUpdate" class="invisible"/>
      </label>
      <span>Preview</span> 
            <img
              class="w-[20rem] h-[16rem]  shadow cursor-pointer"
              alt="User avatar"
              id="postImg"
              src="http://localhost:2200/uploads/${result.image}"
            />
        <footer class="flex justify-between mt-2">
          <button
          onclick="updatePost('${result._id}','${result.image}')"
            class="flex items-center py-2 px-4 rounded-lg text-sm bg-blue-600 text-white shadow-lg"
          >
            Update
            <svg
              class="ml-1"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </footer>
      </div>

    </div>
  </div>`;
  imageUpdate.onchange = () => {
    const [file] = imageUpdate.files;
    if (file) {
      postImg.src = URL.createObjectURL(file);
      previewName.innerText = file.name;
    }
  };
  // Close modal when click the document, see three dots to handle display and visibility
  // document.addEventListener("click", () => {
  //   displayEditModal.classList.add("invisible");
  //   displayEditModal.classList.add("hidden");
  // });
}

async function updatePost(id, text) {
  const jwt = localStorage.getItem("token");

  const content = document.querySelector("#contentUpdate").value;
  const image = document.querySelector("#imageUpdate").files[0];

  let formData = new FormData();
  formData.append("content", content);
  formData.append("image", image);

  const request = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  };

  const apiRequest = await fetch(
    `http://localhost:2200/post/update/${id}`,
    request
  );

  const result = await apiRequest.json();

  if (!result.success) {
    window.alert(`${result.msg}`);
    return;
  }
  window.alert(`${result.msg}`);
  window.location.reload();

  return;
}

async function getUserProfil() {
  const jwt = localStorage.getItem("token");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const apiRequest = await fetch(
    `http://localhost:2200/user/getone/${id}`,
    request
  );
  const [result] = await apiRequest.json();

  const getAllFollowing = await fetch(
    `http://localhost:2200/user/alluserfollowing/${id}`,
    request
  );
  const following = await getAllFollowing.json();

  const getAllFollower = await fetch(
    `http://localhost:2200/user/alluserfollower/${id}`,
    request
  );

  const follower = await getAllFollower.json();

  const getAllPosts = await fetch(
    `http://localhost:2200/post/getoneuserpost/${id}`,
    request
  );

  const posts = await getAllPosts.json();
  console.log(posts);

  following.forEach((element) => {
    userFollowing.innerHTML += `<li class="flex flex-col items-center space-y-2">
    <a class="block bg-white p-1 rounded-full" href="#">
      <img
        class="w-16 rounded-full"
        src="http://localhost:2200/uploads/${element.image}"
      />
    </a>
    <span class="text-xs text-gray-500"> ${element.first_name} ${element.last_name} </span>
  </li>`;
  });
  follower.forEach((e) => {
    userFollower.innerHTML += `<li class="flex flex-col items-center space-y-2">
    <a class="block bg-white p-1 rounded-full" href="#">
      <img
        class="w-16 rounded-full"
        src="http://localhost:2200/uploads/${e.image}"
      />
    </a>
    <span class="text-xs text-gray-500"> ${e.first_name} ${e.last_name} </span>
  </li>`;
  });
  userProfil.innerHTML += `<div class="flex flex-col gap-1 text-center items-center">
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
  <div class="flex justify-center items-center gap-2 my-3">
 
  </div>

</div>`;
  const getUser = await fetch(`http://localhost:2200/user/useronline`, request);
  const [user] = await getUser.json();

  posts.forEach((element) => {
    let comments = "";

    for (let i = 0; i < element.comments.length; i++) {
      const commentFirstName = element.comments[i].first_name;
      const commentLastName = element.comments[i].last_name;
      const commentUserImage = element.comments[i].user_image;
      const commentContent = element.comments[i].content;
      const commentDate = element.comments[i].createdAt;
      comments += `<div class="text-black p-4 antialiased flex">
      <img
        class="rounded-full h-8 w-8 mr-2 mt-1"
        src="http://localhost:2200/uploads/${commentUserImage}"
      />
      <div>
        <div class="bg-gray-100 rounded-lg px-4 pt-2 pb-2.5">
          <div class="font-semibold text-sm leading-relaxed">
            ${commentFirstName} ${commentLastName}
          </div>
          <div class="text-xs leading-snug md:leading-normal">
            ${commentContent}
          </div>
        </div>
        <div class="text-xs mt-0.5 text-gray-500">${new Date(
          commentDate
        ).toLocaleDateString("fr-FR")}</div>
        <div
          class="bg-white border border-white rounded-full float-right -mt-8 mr-0.5 flex shadow items-center"
        >
          
        </div>
      </div>
    </div>`;
    }
    getUserPosts.innerHTML += `<div class="allpost bg-white shadow rounded-lg mb-6 p-4">
    <div class="flex flex-row px-2 py-3 mx-3">
      <div class="w-auto h-auto rounded-full">
        <img
          class="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
          alt="User avatar"
          src="http://localhost:2200/uploads/${element.user_image}"
        />
      </div>
      <div class="flex flex-col mb-2 ml-4 mt-1">
        <div class="text-gray-600 text-sm font-semibold"> ${
          element.first_name
        } ${element.last_name} </div>
        <div class="flex w-full mt-1">
          
          <div class="text-gray-400 font-thin text-xs">
            • ${new Date(element.created_at).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </div>
      <div class="ml-auto flex flex-col gap-1 cursor-pointer relative w-8 items-center"
      id="menu-${element._id}"
      onclick="displayMenu('${element._id}')"
      >
          <span class="h-1 text-xl">.</span>
          <span class="h-1 text-xl">.</span>
          <span class="h-1 text-xl">.</span>
              <div class="flex flex-col gap-2 absolute py-2 px-3 top-[40px] left-[-30px] bg-white border invisible"
                  id="submenu-${element._id}">
                      <button onclick="displayEdit('${
                        element._id
                      }')">Edit</button>
                      <button class="text-red-400" onclick="deletePost('${
                        element._id
                      }')">Delete
                      </button>
              </div>
      </div>
    </div>
    <div class="border-b border-gray-100"></div>
    <div class="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
              <img class="rounded w-full" src="http://localhost:2200/uploads/${
                element.image
              }" />
            </div>
    <div class="text-gray-500 text-sm mb-6 mx-3 px-2">
      ${element.content}
    </div>
    <div class="flex justify-start mb-4 border-t border-gray-100">
      <div class="flex w-full mt-1 pt-2 pl-5">
       <button class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
       onclick="displayComments('${element._id}')"
       id="commentsBtn-${element._id}">       
        
          <svg
          class="h-4 w-4 text-gray-500"

            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="14px"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" 
            ></path>
          </svg>
        
        </button>
      </div>
      <div class="flex justify-end w-full mt-1 pt-2 pr-5">
      <button class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
      onclick="like('${element._id}')">
      
        <svg
          class="h-4 w-4 text-red-500"
          id="like-${element._id}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
          ></path>
        </svg>
      </button>
        
      </div>
    </div>
    <div class="flex w-full border-t border-gray-100">
      <div class="mt-3 mx-5 flex flex-row text-xs">
        <div
          class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center"
        >
          Comments:
          <div class="ml-1 text-gray-400 text-ms"> ${
            element.comments.length
          } </div>
        </div>
        
      </div>
      <div class="mt-3 mx-5 w-full flex justify-end text-xs">
        <div
          class="flex text-gray-700 rounded-md mb-2 mr-4 items-center"
        >
          Likes:
          <div class="ml-1 text-gray-400 text-ms">${element.like.length}</div>
        </div>
      </div>
    </div>
    <div class="h-2 invisible"
    id="comments-${element._id}">
    ${comments}
    </div>
    <div
      class="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400"
    >
      <img
        class="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
        alt="User avatar"
        src="http://localhost:2200/uploads/${user.image}"
      />
      <span class="absolute inset-y-0 right-0 flex items-center pr-6">
        <button
          onclick="addComment('${element._id}')"
          class="p-1 focus:outline-none focus:shadow-none hover:text-blue-500"
            >
            <svg
            class="ml-1"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </span>
      <input
        type="text"
        id="content-${element._id}"
        class="content w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
        style="border-radius: 25px"
        placeholder="Post a comment..."
        autocomplete="off"
        value=""
      />
    </div>
  </div>`;
    const like = document.querySelector("#like-" + element._id);

    if (element.like.includes(user.user_id)) {
      like.style.fill = "red";
    }
  });
}

if (userProfil) {
  getUserProfil();
}
