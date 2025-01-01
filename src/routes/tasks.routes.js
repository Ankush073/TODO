import {Router} from 'express'
import {createTask,
      getAllTasks,
      getTaskById,
      updateTaskStatus,
      deleteTaskById} from '../controllers/tasks.controller.js'
const router =Router()
router.route('/tasks')
    .post(createTask) // Create a new task
    .get(getAllTasks); // Fetch all tasks

router.route('/tasks/:id')
    .get(getTaskById) // Fetch a task by ID
    .delete(deleteTaskById); // Delete a task by ID

router.route('/tasks/:id/status')
    .put(updateTaskStatus) // Update the task status
export default router