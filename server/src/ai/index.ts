import embeddings from './embeddings.service.js'
import { getVectorStore, addDocuments, similaritySearch } from './vector-store.service.js'

export { default as embeddings } from './embeddings.service.js'
export { searchSimilar, getContext, askWithContext, indexDocument } from './rag.service.js'