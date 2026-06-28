Projekt: TaskFlow - aplikacja do zarządzania zadaniami z tablicą Kanban
Krok po kroku
Faza 1: Backend (Express + Prisma)
1. Zdefiniuj modele danych
- User - już masz
- Project - projekt z nazwą, opisem
- Task - zadanie: tytuł, opis, status (todo/in-progress/done), priorytet, projektId, przypisanyUserId
2. Zaimplementuj autoryzację
- Rejestracja/logowanie z JWT
- Middleware auth do chronienia tras
- Haszowanie haseł (bcrypt)
3. API routes
POST   /api/auth/register
POST   /api/auth/login
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id/tasks
POST   /api/tasks
PATCH  /api/tasks/:id    (zmiana statusu)
DELETE /api/tasks/:id

Faza 2: Frontend (React)
1. Pages
- /login, /register
- /dashboard - lista projektów
- /projects/:id - tablica Kanban
2. Komponenty
- TaskCard - pojedyncze zadanie
- Column - kolumna (Todo/In Progress/Done)
- KanbanBoard - cała tablica
- ProjectCard - karta projektu
- Navbar - nawigacja
3. Services
- auth.service.ts - API auth
- project.service.ts - CRUD projektów
- task.service.ts - CRUD zadań
4. State (Zustand)
- useAuthStore - user, token, login/logout
- useProjectStore - projekty, aktualny projekt
- useTaskStore - zadania

Faza 3: Integracja
1. Połącz frontend z backendem (axios z interceptorem dla JWT)
2. Drag & drop zadań między kolumnami (react-beautiful-dnd)
3. Obsługa błędów i loading states
---

┌─────────────────────────────────────────────────────┐
│                   TaskFlow AI                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────┐   ┌──────────────────┐   │
│  │   Frontend (React)   │   │  Backend (Express)│   │
│  │                      │   │                   │   │
│  │  - ChatPanel         │   │  - /api/ai/chat   │   │
│  │  - AIAssistant page  │   │  - /api/ai/ask    │   │
│  │  - Floating chat     │   │  - /api/ai/embed  │   │
│  │  - SmartTaskForm     │   │                   │   │
│  └──────────┬───────────┘   └────────┬──────────┘   │
│             │                        │               │
│     ┌───────┴────────────────────────┴───────┐      │
│     │           LangChain Agent               │      │
│     │  ┌─────────────────────────────────┐   │      │
│     │  │  Tools:                          │   │      │
│     │  │  - search_tasks (RAG)           │   │      │
│     │  │  - create_task                  │   │      │
│     │  │  - get_project_info             │   │      │
│     │  │  - get_task_analytics           │   │      │
│     │  └─────────────────────────────────┘   │      │
│     │  ┌─────────────────────────────────┐   │      │
│     │  │  Memory: ConversationBuffer     │   │      │
│     │  └─────────────────────────────────┘   │      │
│     └──────────────────┬────────────────────┘      │
│                        │                            │
│     ┌──────────────────┴────────────────────┐      │
│     │          Vector Database              │      │
│     │  ┌──────────────────────────────┐    │      │
│     │  │  ChromaDB (lokalnie)         │    │      │
│     │  │  - task_embeddings           │    │      │
│     │  │  - project_embeddings        │    │      │
│     │  └──────────────────────────────┘    │      │
│     └─────────────────────────────────────┘      │
│                        │                            │
│     ┌──────────────────┴────────────────────┐      │
│     │        OpenAI / Ollama                │      │
│     │  - embeddings (text-embedding-3)      │      │
│     │  - LLM (gpt-4 / gpt-3.5)             │      │
│     └─────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘