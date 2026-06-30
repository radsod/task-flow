import { ChromaClient } from 'chromadb'
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

    console.log(`Znaleziono ${task.length} zadan`)

    const docs: Document[] = task.map((task) => {
        const content = [
            `Tytył: ${task.title}`,
            task.description ? `Opis: ${task.description}` : null,
            `Status: ${task.status}`,
            `Priorytet: ${task.priority}`,
            `Projekt: ${task.project.name}`,
            task.assignee ? `Przypisane do: ${task.assignee.name}` : null, 
        ]
            .filter(Boolean)
            .join('\n')

        return new Document({
            pageContent: content,
            metadata: {
                id: task.id,
                title: task.title,
                status: task.status,
                priority: task.priority,
                projectId: task.projectId,
                projectName: task.project.name,
            },
        })
    })

    const client = new ChromaClient({
        host: "localhost",
        port: 8000,
        ssl: false
    })

    try {
        await client.deleteCollection({
            name: COLLECTION_NAME,
        })
    } catch {}

    const vectorStore = new Chroma(embeddings, {
        collectionName: COLLECTION_NAME,
        url: "http://localhost:8000"
    })
    await vectorStore.addDocuments(docs)
    console.log(`Zindeksowano ${docs.length} dokumentów do Chroma`)
}

seed()