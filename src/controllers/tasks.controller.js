// Initialize an in-memory tasks array
let tasks = [];

// Controller to create a new task
const createTask = (req, res) => {
    const { id, title, description } = req.body;

    // Check if all fields are provided
    if (!id || !title || !description) {
        return res.status(400).json({ error: 'ID, title, and description are required.' });
    }

    // Check if the ID already exists
    if (tasks.some((task) => task.id === id)) {
        return res.status(400).json({ error: 'Task with the given ID already exists.' });
    }

    // Create a new task object
    const newTask = {
        id,            // Provided unique identifier for the task
        title,         // Task title
        description,   // Task description
        status: 'pending', // Default status is 'pending'
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Respond with the newly created task
    res.status(201).json(newTask);
};

// Controller to fetch all tasks
const getAllTasks = (req, res) => {
    // Respond with the entire tasks array
    res.status(200).json(tasks);
};

// Controller to fetch a specific task by its ID
const getTaskById = (req, res) => {
    const { id } = req.params;

    // Find the task by its ID
    const task = tasks.find((task) => task.id === id);

    // If the task is not found, return a 404 error
    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    // Respond with the task details
    res.status(200).json(task);
};

// Controller to update the status of a task
const updateTaskStatus = (req, res) => {
    const { id: paramId } = req.params; // Take ID from the URL
    const { status } = req.body;

    // Keep ID as a string to match the tasks array
    const id = paramId;

    const validStatuses = ['pending', 'in-progress', 'completed'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            error: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`,
        });
    }

    // Find the task by its ID
    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    // Update the task's status
    task.status = status;

    res.status(200).json(task);
};

// Controller to delete a task by its ID
const deleteTaskById = (req, res) => {
      const { id } = req.params; // Take ID from the request parameters
  
      // Find the index of the task to be deleted
      const taskIndex = tasks.findIndex((task) => task.id === id);
  
      // If the task is not found, return a 404 error
      if (taskIndex === -1) {
          return res.status(404).json({ error: 'Task not found.' });
      }
  
      // Remove the task from the tasks array
      tasks.splice(taskIndex, 1);
  
      // Respond with a success message and status 200
      res.status(200).json({ message: 'Task successfully deleted.' });
  };
  

// Export the controller functions for use in other parts of the application
export {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskStatus,
    deleteTaskById,
};


