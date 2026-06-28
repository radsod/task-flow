import embeddings from "./embeddings.service";

const text = 'Zadanie do zrobienia: zrobić zakupy'

const vector = await embeddings.embedQuery(text)

console.log('Tekst:', text)
console.log('Wektor (pierwsze 5 wartości):', vector.slice(0, 5))
console.log('Długość wektora:', vector.length)