import prisma from '../utils/prisma.js'
import embeddings from './embeddings.service.js'
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { Document } from '@langchain/core/documents'

const COLLECTION_NAME = 'taskflow_embeddings'
 
async function seed() {
    console.log('Pobieranie zadań z bazy SQL...')
    
    const task = await prisma.task.findMany({
        include: {
            project: { select: { name: true } },
            assignee: { select: { name: true } },
        },
    })

    
}