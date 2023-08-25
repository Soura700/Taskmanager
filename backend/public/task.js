let items = [];
let selectedTaskId = null;
let selectedTaskElement = null;



document.addEventListener("DOMContentLoaded", (event) => {
  var dragSrcEl = null;

  function handleDragStart(e) {
    this.style.opacity = "0.1";
    this.style.border = "3px dashed #c4cad3";

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "move";

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add("task-hover");
  }

  function handleDragLeave(e) {
    this.classList.remove("task-hover");
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData("text/html");
    }

    return false;
  }

  function handleDragEnd(e) {
    this.style.opacity = "1";
    this.style.border = 0;

    items.forEach(function (item) {
      item.classList.remove("task-hover");
    });
  }

  let items = document.querySelectorAll(".task");
  items.forEach(function (item) {
    item.addEventListener("dragstart", handleDragStart, false);
    item.addEventListener("dragenter", handleDragEnter, false);
    item.addEventListener("dragover", handleDragOver, false);
    item.addEventListener("dragleave", handleDragLeave, false);
    item.addEventListener("drop", handleDrop, false);
    item.addEventListener("dragend", handleDragEnd, false);
  });
});

// Opening the modal

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openButton = document.querySelector(".project-participants__add");
  const closeButton = document.querySelector(".close");
  const form = document.getElementById("participant-form");

  openButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    // Do something with the title and description, like sending it to a server
    // or updating the page dynamically.

    try {
      const response = await fetch("https://taskmanager-production-fcf0.up.railway.app/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message); // Success message from the server
        // You can update the page dynamically with the new task data if needed
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }

    // Clear the form fields
    form.reset();

    // Close the modal
    modal.style.display = "none";
  });
});



// Function to create a task element
// function createTaskElement(task) {
//   const date = task.createdAt.split("T");

//   return `
//     <div class='task' draggable='true' data-task-id="${task._id}">
//     <div class='task__tags'><span class='task__tag task__tag--illustration'>${task.status}</span><button class='task__options'><i class="fas fa-ellipsis-h"></i></button></div>
//     <button class="task__update-button">Update</button>
//     <button class="task__delete-button" data-task-id="${task._id}>Delete</button>
//     <p>${task.title}</p>
//     <p>${task.description}</p>
//     <div class='task__stats'>
//       <span><time datetime="${date[0]}"><i class="fas fa-flag"></i>${date[0]}</time></span>
//       <span class='task__owner'></span>
//     </div>
//   </div>
//   `;
// }

function createTaskElement(task) {
  const date = task.createdAt.split("T");

  return `
    <div class='task' draggable='true' data-task-id="${task._id}">
    <div class='task__tags'><span class='task__tag task__tag--illustration'>${task.status}</span><button class='task__options'><i class="fas fa-ellipsis-h"></i></button></div>
    <button class="task__update-button">Update</button>
    <button class="task__delete-button" data-task-id="${task._id}">Delete</button>
    <p>${task.title}</p>
    <p>${task.description}</p>
    <div class='task__stats'>
      <span><time datetime="${date[0]}"><i class="fas fa-flag"></i>${date[0]}</time></span>
      <span class='task__owner'></span>
    </div>
  </div>
  `;
}



// Assume you have a function to fetch tasks from your API

async function fetchTasks() {
  return fetch("https://taskmanager-production-fcf0.up.railway.app/api/getTasks")
    .then((res) => {
      // console.log(res); // Debugging the response status
      return res.json();
    })
    .then((res) => {
      const ans = JSON.stringify(res);
      const final = JSON.parse(ans);
      return final;
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });
}

function appendTasksToSections(tasks) {
  var dragSrcEl = null;

  function handleDragStart(e) {
    this.style.opacity = "0.1";
    this.style.border = "3px dashed #c4cad3";

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "move";

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add("task-hover");
  }

  function handleDragLeave(e) {
    this.classList.remove("task-hover");
  }

  async function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData("text/html");

      // New
      const draggedTaskId = dragSrcEl.getAttribute("data-task-id");
      const droppedTaskId = this.getAttribute("data-task-id");
      const newStatus = this.closest(".project-column")
        .querySelector(".project-column-heading__title")
        .textContent.trim();
      updateTaskStatus(draggedTaskId, newStatus);
    }

    return false;
  }

  function handleDragEnd(e) {
    this.style.opacity = "1";
    this.style.border = 0;

    items.forEach(function (item) {
      item.classList.remove("task-hover");
    });
  }

  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const readyTask = tasks.filter((task) => task.status === "Task Ready");
  const doneTask = tasks.filter((task) => task.status === "Done");
  // const form = document.getElementById("update-form");

  inProgressTasks.forEach(function (task) {
    const taskElement = createTaskElement(task);

    const sectionTitles = document.querySelectorAll(
      ".project-column-heading__title"
    );

    sectionTitles.forEach(function (sectionTitle) {
      // For In progress
      if (sectionTitle.textContent.trim() === "In Progress") {
        const column = sectionTitle.closest(".project-column");

        // Create a temporary container to parse the taskElement
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = taskElement;

        const updateButton = tempContainer.querySelector(
          ".task__update-button"
        );
        const closeButton = document.querySelector(".close1");
        

        updateButton.addEventListener("click", function () {

          
          selectedTaskId = task._id;
          selectedTaskElement = this.closest(".task");

            // Clear the form fields
           document.getElementById("title").value = "";
          document.getElementById("description").value = "";
        
          modal1.style.display = "block";


        });



        closeButton.addEventListener("click", function () {
          // Open the modal
          modal1.style.display = "none";
        });

        // Append the parsed task element to the column
        column.appendChild(tempContainer.firstElementChild);

        let items = document.querySelectorAll(".task");
        items.forEach(function (item) {
          item.addEventListener("dragstart", handleDragStart, false);
          item.addEventListener("dragenter", handleDragEnter, false);
          item.addEventListener("dragover", handleDragOver, false);
          item.addEventListener("dragleave", handleDragLeave, false);
          item.addEventListener("drop", handleDrop, false);
          item.addEventListener("dragend", handleDragEnd, false);
        });
      }
    });
  });

  readyTask.forEach(function (task) {
    const taskElement = createTaskElement(task);

    const sectionTitles = document.querySelectorAll(
      ".project-column-heading__title"
    );

    sectionTitles.forEach(function (sectionTitle) {
      // For In progress
      if (sectionTitle.textContent.trim() === "Task Ready") {
        const column = sectionTitle.closest(".project-column");

        // Create a temporary container to parse the taskElement
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = taskElement;
        const update1Button = tempContainer.querySelector(
          ".task__update-button"
        );
        const closeButton = document.querySelector(".close1");

        // update1Button.addEventListener("click", function () {
        //   // Open the modal
        //   modal1.style.display = "block";
        // });

        update1Button.addEventListener("click", function () {

          
          selectedTaskId = task._id;
          selectedTaskElement = this.closest(".task");

            // Clear the form fields
           document.getElementById("title").value = "";
          document.getElementById("description").value = "";
        
          modal1.style.display = "block";


        });

        closeButton.addEventListener("click", function () {
          // Open the modal
          modal1.style.display = "none";
        });

        // Append the parsed task element to the column
        column.appendChild(tempContainer.firstElementChild);

        let items = document.querySelectorAll(".task");
        items.forEach(function (item) {
          item.addEventListener("dragstart", handleDragStart, false);
          item.addEventListener("dragenter", handleDragEnter, false);
          item.addEventListener("dragover", handleDragOver, false);
          item.addEventListener("dragleave", handleDragLeave, false);
          item.addEventListener("drop", handleDrop, false);
          item.addEventListener("dragend", handleDragEnd, false);
        });
      }
    });
  });

  doneTask.forEach(function (task) {
    const taskElement = createTaskElement(task);

    const sectionTitles = document.querySelectorAll(
      ".project-column-heading__title"
    );

    sectionTitles.forEach(function (sectionTitle) {
      // For In progress
      if (sectionTitle.textContent.trim() === "Done") {
        const column = sectionTitle.closest(".project-column");

        // Create a temporary container to parse the taskElement
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = taskElement;
        const update2Button = tempContainer.querySelector(
          ".task__update-button"
        );
        const closeButton = document.querySelector(".close1");
        // update2Button.addEventListener("click", function () {
        //   // Open the modal
        //   modal1.style.display = "block";
        // });


        update2Button.addEventListener("click", function () {

          
          selectedTaskId = task._id;
          selectedTaskElement = this.closest(".task");

            // Clear the form fields
           document.getElementById("title").value = "";
          document.getElementById("description").value = "";
        
          modal1.style.display = "block";


        });

        closeButton.addEventListener("click", function () {
          // Open the modal
          modal1.style.display = "none";
        });

        // Append the parsed task element to the column
        column.appendChild(tempContainer.firstElementChild);

        let items = document.querySelectorAll(".task");
        items.forEach(function (item) {
          item.addEventListener("dragstart", handleDragStart, false);
          item.addEventListener("dragenter", handleDragEnter, false);
          item.addEventListener("dragover", handleDragOver, false);
          item.addEventListener("dragleave", handleDragLeave, false);
          item.addEventListener("drop", handleDrop, false);
          item.addEventListener("dragend", handleDragEnd, false);
        });
      }
    });
  });
}

async function updateTaskStatus(taskId, newStatus) {
  try {
    const response = await fetch(`https://taskmanager-production-fcf0.up.railway.app/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      console.log("Task status updated successfully");
    } else {
      alert("Error");
      console.error("Error updating task status");
    }
  } catch (error) {
    console.error("An error occurred while updating task status:", error);
  }
}



document.addEventListener("DOMContentLoaded", function () {


  const updateForm = document.getElementById("update-form");

  // openButton.addEventListener("click", function () {
  //   modal.style.display = "block";
  // });

  // closeButton.addEventListener("click", function () {
  //   modal.style.display = "none";
  // });

  updateForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("update_title").value;
    const description = document.getElementById("update_description").value;

    console.log(title + description)

    // Do something with the title and description, like sending it to a server
    // or updating the page dynamically.

    try {
      const response = await fetch("https://taskmanager-production-fcf0.up.railway.app/api/tasks/" + selectedTaskId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Hello"+responseData.message); // Success message from the server
        // You can update the page dynamically with the new task data if needed
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }

    // Clear the form fields
    updateForm.reset();

    // Close the modal
    modal1.style.display = "none";
  });


  document.addEventListener("click", async function (event) {
    if (event.target.classList.contains("task__delete-button")) {
      const taskId = event.target.getAttribute("data-task-id");
      if (confirm("Are you sure you want to delete this task?")) {
        try {
          const response = await fetch(`https://taskmanager-production-fcf0.up.railway.app/api/tasks/${taskId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            // Remove the deleted task element from the UI
            const taskElement = event.target.closest(".task");
            taskElement.parentNode.removeChild(taskElement);
            console.log("Task deleted successfully");
          } else {
            console.error("Failed to delete task");
          }
        } catch (error) {
          console.error("An error occurred while deleting task", error);
        }
      }
    }
  });

  
});


document.addEventListener("DOMContentLoaded", function () {
  fetchTasks()
    .then((tasks) => {
      // console.log(tasks); // Debugging statement
      appendTasksToSections(tasks);
    })
    .catch((error) => console.log(error));
});

