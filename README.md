# Chocobliss Coffee Roastery ☕✨

A premium coffee shop website and backend service for **Chocobliss Coffee**.

## 📁 Repository Structure

```
├── doc/                        # Documentation & Planning Specifications
│   ├── PRD.md                  # Product Requirements Document
│   ├── TRD.md                  # Technical Requirements Document
│   ├── UIUX.md                 # UI/UX Design Specifications
│   ├── TRACKING_AGENT.md       # AI Agent Workflow & Verification Rules
│   └── IMPLEMENTATION.md       # Phase-by-phase Implementation Roadmap
│
├── frontend/                   # Frontend Workspace (Next.js 14 App Router)
│   ├── public/
│   │   ├── animations/         # Lottie animations
│   │   ├── images/             # Product photography & posters
│   │   └── videos/             # Background videos (coffee pour, steam, etc.)
│   └── src/
│       ├── app/                # Next.js App Router pages
│       ├── components/         # Layout & UI components
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # Utility & client libraries
│       └── types/              # TypeScript definitions
│
└── backend/                    # Backend API Service (Node.js / Express / Supabase)
    └── src/
        ├── config/             # Environment & service configurations
        ├── controllers/        # Request controllers
        ├── middleware/         # Auth, validation & rate limiting
        ├── routes/             # REST API routes
        ├── schemas/            # Zod validation schemas
        ├── services/           # Business logic & database operations
        └── types/              # Backend TypeScript types
```

## 🌿 Branches

- **`main`**: Combined baseline containing documentation and overall folder structure.
- **`frontend`**: Dedicated branch for frontend Next.js application development.
- **`backend`**: Dedicated branch for backend API development.

---

*Phase 1 implementation will commence upon trigger as specified in [doc/IMPLEMENTATION.md](doc/IMPLEMENTATION.md).*
