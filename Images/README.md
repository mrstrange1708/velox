# Velox — System Design Documentation

This directory contains comprehensive UML and architectural diagrams for the **Velox** codebase — a high-performance, containerized Online Judge / Remote Code Execution Engine.

---

## 📑 Document Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [Class Diagram](./01_class_diagram.md) | All Go structs, interfaces, their fields, methods, and the packages they belong to. Includes Judge Engine and Auth Module. |
| 2 | [Relationship Diagram](./02_relationship_diagram.md) | Package-level and struct-level dependencies across the backend and frontend. |
| 3 | [Sequence Diagram](./03_sequence_diagram.md) | Step-by-step message flow for code submission and status polling. |
| 4 | [Use Case Diagram](./04_use_case_diagram.md) | All actors (User, API, Worker, Redis, CI Pipeline) and the operations they perform. |
| 5 | [ER Diagram](./05_er_diagram.md) | Entity-Relationship model of the data structures flowing through the system. |
| 6 | [Component / Deployment Diagram](./06_component_diagram.md) | Docker services, containers, CI/CD pipeline, and network topology. |
| 7 | [Design Patterns Reference](./07_design_patterns.md) | Comprehensive catalog of all design patterns used in Velox and where each is applied. |

---

## 🏗 Architecture at a Glance

Velox follows a **producer-consumer** architecture with a **Strategy Pattern** based execution engine:

```
┌──────────┐       ┌───────┐       ┌──────────┐
│  Client   │──────▸│  API  │──────▸│  Redis   │
│ (Browser) │       │Server │       │ (Queue)  │
└──────────┘       └───────┘       └────┬─────┘
                       │                │
                   ┌───▼────┐      ┌────▼─────┐
                   │  Auth  │      │  Worker   │
                   │ Module │      │ (Judge)   │
                   └───┬────┘      └──────────┘
                   ┌───▼────┐
                   │Postgres│
                   │  (DB)  │
                   └────────┘
```

1. The **Client** sends a `POST /submit` with source code and test cases.
2. The **API Server** authenticates via API Key, assigns a UUID, pushes the job into a Redis queue, and returns immediately.
3. The **Worker** pops jobs from the queue, uses the **Strategy Pattern** to route to the correct language handler, compiles/runs the code, and pushes results back into Redis.
4. The **Client** polls `GET /status?submission_id=...` until results are ready.

---

## 🧩 Key Design Patterns

For a complete reference of all design patterns used in Velox, see [07_design_patterns.md](./07_design_patterns.md).

| Pattern | Primary Location |
|---------|-----------------|
| Strategy | `processSubmission/` — Language compilation routing |
| Composition | `InterpreterStrategyManager` — Shared interpreter logic |
| Adapter | `DefaultRunner`, `LocalTempStorageAdapter` |
| Repository | `auth/repository/` — Data access layer |
| Producer-Consumer | API → Redis → Worker |
| Middleware Chain | `auth/middleware/` — JWT, API Key, Security Headers |

---

## 📖 How to Read the Diagrams

All diagrams use [Mermaid](https://mermaid.js.org/) syntax. You can render them:

- **GitHub**: Mermaid blocks render natively in `.md` files on GitHub.
- **VS Code**: Install the "Markdown Preview Mermaid Support" extension.
- **Online**: Paste blocks into [mermaid.live](https://mermaid.live).
