import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import embeddings from "./embeddings.service";

const COLLECTION_NAME = 'taskflow_embeddings'

let vectorStore: Chroma | null = null

async function getStore(): Promise<Chroma> {
   if(!vectorStore) {
    vectorStore = new Chroma(embeddings, {
        collectionName: COLLECTION_NAME,
        url: 'http://localhost:8000'
    })
   } 
   return vectorStore
}

export async function searchSimilar(query: string, k: number = 5) {
   const store = await getStore()
   return store.similaritySearchWithScore(query, k) 
}

export async function getContext(query: string, k: number = 5): Promise<string> {
    const result = await searchSimilar(query, k)

    if(result.length === 0) return 'Brak powiązanych zadań w bazie'

    return result
     .map(([doc, score], i) => {
        return `[Dokument ${i + 1}] (dopadowanie: ${(score * 100).toFixed(1)}%\n${doc.pageContent}\n)`
     })
     .join('\n')
}

export async function askWithContext(question: string): Promise<string> {
   const context = await getContext(question) 

   const llm = new ChatOllama({
    model: 'llama3.2',
    baseUrl: 'http://localhost:11434',
    temperature: 0.3,
   })

   const prompt = [
    'Jesteś asystemtem AI do zarządzania zadaniami w aplikacji TaskFlow.',
    'Odpowiadasz wyłącznie na podstawie poniszego kontekstu z bazy wiedzy.', 
    'Jeśli kontekst nie zawiera odpowiedzi, przyznaj że nie wiesz.',
    '',
    '=== KONTEKST ===',
    context,
    '', 
    '=== PYTANIE ===',
    question,
    '',
    '=== ODPOWIEDŹ ===',
   ].join('\n')

   const response = await llm.invoke(prompt)
   return response.content.toString()
}

export async function indexDocument(doc: {
    id: number
    title: string
    description: string | null
    status: string
    priority: string
    projectName: string
    assigneeName: string | null
}) {
    const store = await getStore()

    const content = [
        `Tytuł: ${doc.title}`,
        doc.description ? `Opis: ${doc.description}` : null,
        `Status: ${doc.status}`,
        `Priorytet: ${doc.priority}`,
        `Projekt: ${doc.projectName}`,
        doc.assigneeName ? `Przypisane do: ${doc.assigneeName}` : null,
    ]
        .filter(Boolean)
        .join('\n')

    await store.addDocuments([
        {
            pageContent: content,
            metadata: {
                id: doc.id,
                title: doc.title,
                status: doc.status,
                priority: doc.priority,
            },
        },
    ])
   
    console.log(`Zindeksowano zadanie #${doc.id}: ${doc.title}`)
}