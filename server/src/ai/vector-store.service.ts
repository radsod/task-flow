import { Chroma } from "@langchain/community/vectorstores/chroma"
import embeddings from "./embeddings.service"
import { Document } from '@langchain/core/documents'
import { url } from 'inspector'

const COLLECTION_NAME = 'taskflow_embeddings'

let vectorStore: Chroma | null = null

export async function getVectorStore(): Promise<Chroma> {
    if(vectorStore) return vectorStore

    vectorStore = new Chroma(embeddings, {
        collectionName: COLLECTION_NAME,
        url: 'http://localhost:8000',
    })

    return vectorStore
}

export async function addDocuments(docs: Document[]) {
    const store = await getVectorStore()
    await store.addDocuments(docs)
}

export async function similaritySearch(query: string, k: number = 5) {
    const store = await getVectorStore()
    return store.similaritySearch(query, k)
}
