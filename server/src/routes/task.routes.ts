import { Router, Response, NextFunction } from 'express'
import { body, param } from 'express-validator'
import prisma from '../utils/prisma.js'
import { auth } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { AuthRequest } from '../utils/jwt.js'
import { AppError } from '../middleware/errorHandler.js'
const router = Router()
router.use(auth)
// POST /api/tasks
router.post('/', [
  body('title').trim().notEmpty(),
  body('description').optional().trim(),
  body('projectId').isInt(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('assigneeId').optional().isInt(),
  validateRequest,
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, projectId, priority, assigneeId } = req.body
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true }
    })
    if (!project || project.userId !== req.user!.userId) {
      throw new AppError('Project not found', 404)
    }
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        projectId,
        status: 'todo',
        priority: priority || 'medium',
        assigneeId: assigneeId || null
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    res.status(201).json(task)
  } catch (error) {
    next(error)
  }
})
// PATCH /api/tasks/:id
router.patch('/:id', [
  param('id').isInt(),
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in_progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('assigneeId').optional(),
  validateRequest,
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id)
    const { title, description, status, priority, assigneeId } = req.body
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    })
    if (!existingTask || existingTask.project.userId !== req.user!.userId) {
      throw new AppError('Task not found', 404)
    }
    const updateData: {
      title?: string
      description?: string | null
      status?: string
      priority?: string
      assigneeId?: number | null
    } = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description || null
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    res.json(updatedTask)
  } catch (error) {
    next(error)
  }
})
// DELETE /api/tasks/:id
router.delete('/:id', [
  param('id').isInt(),
  validateRequest,
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id)
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    })
    if (!task || task.project.userId !== req.user!.userId) {
      throw new AppError('Task not found', 404)
    }
    await prisma.task.delete({
      where: { id: taskId }
    })
    res.json({ message: 'Task deleted' })
  } catch (error) {
    next(error)
  }
})
export default router
