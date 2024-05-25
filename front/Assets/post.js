const postBtn = document.querySelector(".postBtn");
const postMsg = document.querySelector(".postMsg");
const userPosts = document.querySelector(".userPosts");
const follower = document.querySelector(".follower");
const following = document.querySelector(".following");
const allpost = document.querySelector(".allpost");

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
  if (result.success) {
    // window.alert("addpost");
    // window.location.reload();
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

  const getUser = await fetch(`http://localhost:2200/user/one`, request);
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
        <span
          class="bg-white transition ease-out duration-300 hover:text-red-500 border w-8 h-8 px-2 pt-2 text-center rounded-full text-gray-400 cursor-pointer mr-2"
        >
          <svg
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
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            ></path>
          </svg>
        </span>
        <img
          class="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
          alt=""
        />
        <img
          class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
          alt=""
        />
        <img
          class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80"
          alt=""
        />
        <img
          class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.25&amp;w=256&amp;h=256&amp;q=80"
          alt=""
        />
      </div>
      <div class="flex justify-end w-full mt-1 pt-2 pr-5">
        <span
          class="transition ease-out duration-300 hover:bg-blue-50 bg-blue-100 w-8 h-8 px-2 py-2 text-center rounded-full text-blue-400 cursor-pointer mr-2"
        >
          <svg
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            ></path>
          </svg>
        </span>
        <span
          class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
        >
          <svg
            class="h-4 w-4 text-red-500"
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
        </span>
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
    ${comments}
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
    `http://localhost:2200/user/allfollowing`,
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
  const getUser = await fetch(`http://localhost:2200/user/one`, request);
  const [user] = await getUser.json();
  console.log(result);
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
        <span
          class="bg-white transition ease-out duration-300 hover:text-red-500 border w-8 h-8 px-2 pt-2 text-center rounded-full text-gray-400 cursor-pointer mr-2"
        >
          <svg
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
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            ></path>
          </svg>
        </span>
        <img
          class="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
          alt=""
        />
        <img
          class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
          alt=""
        />
        <img
          class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80"
          alt=""
        />
        <img
          class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.25&amp;w=256&amp;h=256&amp;q=80"
          alt=""
        />
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
    ${comments}
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
  const getUser = await fetch(`http://localhost:2200/user/one`, request);
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
      // window.alert("Disliked");
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
  console.log(result);
  if (result.success) {
    // window.alert("Liked");
    like.style.fill = "red";
    getAllPosts();
  }
}
