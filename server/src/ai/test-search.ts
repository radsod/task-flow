import embeddings from "./embeddings.service";
import { Chroma } from '@langchain/community/vectorstores/chroma'

const COLLECTION_NAME = 'taskflow_embeddings'

async function search() {
    const vectorStore = new Chroma(embeddings, {
        collectionName: COLLECTION_NAME,
        url: 'http://localhost:8000',
    })

    const query = 'coś pilnego do zrobienia'
    const result = await vectorStore.similaritySearch(query, 3)

    console.log(`Zapytanie: "${query}"\n`)
    result.forEach((doc, i) => {
        console.log(`-- Wynik ${i + 1} (podobieństwo) ---`)
        console.log(doc.pageContent)
        console.log()
    })
}

search()