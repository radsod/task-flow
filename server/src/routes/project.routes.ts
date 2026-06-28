import { Router, Response, NextFunction } from 'express'
import { body, param } from 'express-validator'
import prisma from '../utils/prisma.js'
import { auth } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { AuthRequest } from '../utils/jwt.js'
import { AppError } from '../middleware/errorHandler.js'
const router = Router()
router.use(auth)
// GET /api/projects - lista projektów
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        tasks: {
          select: { status: true }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    const projectsWithStats = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      taskCount: project._count.tasks,
      tasksTodo: project.tasks.filter(t => t.status === 'todo').length,
      tasksInProgress: project.tasks.filter(t => t.status === 'in_progress').length,
      tasksDone: project.tasks.filter(t => t.status === 'done').length,
    }))
    res.json(projectsWithStats)
  } catch (error) {
    next(error)
  }
})
// GET /api/projects/:id
router.get('/:id', [
  param('id').isInt(),
  validateRequest,
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.id)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    })
    if (!project || project.userId !== req.user!.userId) {
      throw new AppError('Project not found', 404)
    }
    res.json(project)
  } catch (error) {
    next(error)
  }
})
// GET /api/projects/:id/tasks - lista zadań w projekcie
router.get('/:id/tasks', [
  param('id').isInt(),
  validateRequest,
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.id)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true }
    })
    if (!project || project.userId !== req.user!.userId) {
      throw new AppError('Project not found', 404)
    }
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(tasks)
  } catch (error) {
    next(error)
  }
})
// POST /api/projects
router.post('/', [
  body('name').trim().notEmpty(),
  body('description').optional().trim(),
  validateRequest,
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        userId: req.user!.userId
      }
    })
    res.status(201).json(project)
  } catch (error) {
    next(error)
  }
})
// PATCH /api/projects/:id
router.patch('/:id', [
  param('id').isInt(),
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim(),
  validateRequest,
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.id)
    const { name, description } = req.body
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
      }
    })
    res.json(project)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return next(new AppError('Project not found', 404))
    }
    next(error)
  }
})
// DELETE /api/projects/:id
router.delete('/:id', [
  param('id').isInt(),
  validateRequest,
], async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.id)
    await prisma.project.delete({
      where: { id: projectId }
    })
    res.json({ message: 'Project deleted' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return next(new AppError('Project not found', 404))
    }
    next(error)
  }
})
export default router