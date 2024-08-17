const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim(); // Trim whitespace

  if (!value) return;

  // Create a new task element
  const newTask = document.createElement("p");
  newTask.classList.add("task");
  newTask.setAttribute("draggable", "true");
  newTask.innerText = value;

  // Add drag event listeners to the new task
  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  // Append the new task to the todo lane
  todoLane.appendChild(newTask);

  // Clear the input field
  input.value = "";
});

// Function to handle drag events for existing tasks
const handleDragEvents = () => {
  const draggables = document.querySelectorAll(".task");
  draggables.forEach((task) => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
  });
};

// Initial call to handle drag events
handleDragEvents();

// Handle dragover events for swim lanes
const droppables = document.querySelectorAll(".swim-lane");
droppables.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const curTask = document.querySelector(".is-dragging");

    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }
  });
});

// Function to determine where to insert the dragged task
const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top, bottom } = task.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

// Add event listeners for newly created tasks
const addNewTaskEventListeners = () => {
  const newTasks = document.querySelectorAll(".task");
  newTasks.forEach((task) => {
    if (!task.hasAttribute('data-processed')) {
      task.setAttribute('data-processed', 'true'); // Avoid multiple event bindings
      task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
      });
      task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
      });
    }
  });
};

// Observe for changes in the todo lane to bind events to new tasks
const observer = new MutationObserver(() => {
  addNewTaskEventListeners();
});

observer.observe(todoLane, {
  childList: true,
})