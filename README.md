# Vue State Management Comparison 🚀

A production-ready monorepo showcasing **7 different Vue 3 state management patterns** using **JSONPlaceholder** as the backend API. Built with **Vue 3**, **TypeScript**, **Tailwind CSS**, and **Turborepo**.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [State Management Patterns](#state-management-patterns)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Docker Setup](#docker-setup)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

## 🎯 Overview

This project demonstrates 7 different approaches to state management in Vue 3:

1. **Props & Emits** - Traditional parent-child communication
2. **Provide/Inject** - Dependency injection pattern
3. **Composables** - Composition API reusable functions
4. **Pinia** - Official Vue state management library
5. **Vuex** - Legacy state management (Vue 3 compatible)
6. **RxJS** - Reactive programming with observables
7. **Custom Store** - Event-based custom implementation

Each app implements the same functionality:

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Pagination
- ✅ Search & Filter
- ✅ Loading & Error states
- ✅ Toast notifications
- ✅ Dark/Light mode toggle
- ✅ Responsive UI (mobile, tablet, desktop)

## 🏗️ Architecture

```text
vue-state-management-comparison/
├── apps/                    # 7 Vue applications
│   ├── props/
│   ├── provide-inject/
│   ├── composables/
│   ├── pinia/
│   ├── vuex/
│   ├── rxjs/
│   └── custom-store/
│
├── packages/                # Shared packages
│   ├── api/                 # Axios wrapper for JSONPlaceholder
│   ├── types/               # TypeScript interfaces
│   ├── ui/                  # Shared Tailwind components
│   └── utils/               # Helper functions
│
├── docs/                    # Documentation
│   └── comparison.md        # Detailed comparison
│
├── turbo.json               # Turborepo configuration
├── package.json             # Root package.json
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose setup
└── Makefile                 # Common commands
```

## 📦 State Management Patterns

### 1. Props & Emits

**Port:** `3001`  
**Pattern:** Traditional parent-child component communication via props and events.

**Use Case:** Simple applications with shallow component trees.

### 2. Provide/Inject

**Port:** `3002`  
**Pattern:** Dependency injection for deep component trees.

**Use Case:** Avoiding prop drilling in deeply nested components.

### 3. Composables

**Port:** `3003`  
**Pattern:** Reusable Composition API functions.

**Use Case:** Sharing stateful logic across components.

### 4. Pinia

**Port:** `3004`  
**Pattern:** Official Vue state management library (Vuex successor).

**Use Case:** Medium to large applications requiring centralized state.

### 5. Vuex

**Port:** `3005`  
**Pattern:** Legacy state management pattern (Vue 3 compatible).

**Use Case:** Migrating existing Vue 2 applications or teams familiar with Vuex.

### 6. RxJS

**Port:** `3006`  
**Pattern:** Reactive programming with observables.

**Use Case:** Complex asynchronous data flows and event streams.

### 7. Custom Store

**Port:** `3007`  
**Pattern:** Event-based custom state management implementation.

**Use Case:** Learning state management internals or custom requirements.

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or **npm** >= 9.0.0
- **Docker** (optional, for containerized development)

### Installation

```bash
# Clone the repository
git clone https://github.com/amit373/vue-state-management-comparison
cd vue-state-management-comparison

# Install dependencies (using pnpm - recommended)
pnpm install

# Or using npm
npm install

# Or use Makefile
make install
```


## 🐳 Docker Setup

### Using Docker Compose

```bash
# Build and start all services
make docker-build
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
```

### Manual Docker Commands

```bash
# Build image
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 📁 Project Structure

```text
apps/
├── props/
│   ├── src/
│   │   ├── components/     # PostCard, PostModal, ToastContainer
│   │   ├── views/          # PostsList
│   │   ├── router/         # Vue Router configuration
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── vite.config.ts
│
packages/
├── api/
│   └── src/
│       └── index.ts         # Axios wrapper for JSONPlaceholder
├── types/
│   └── src/
│       └── index.ts         # TypeScript interfaces
├── ui/
│   └── src/
│       ├── Button.vue
│       ├── Input.vue
│       ├── Card.vue
│       └── ...              # Shared UI components
└── utils/
    └── src/
        └── index.ts         # Helper functions
```

## ✨ Features

### All Apps Include

- **CRUD Operations**
  - Create new posts
  - Read/list all posts
  - Update existing posts
  - Delete posts

- **Pagination**
  - Configurable items per page
  - Page navigation
  - Total pages calculation

- **Search & Filter**
  - Real-time search by title/body
  - Filter by user ID
  - Debounced search input

- **Loading & Error States**
  - Loading spinners
  - Error messages
  - Graceful error handling

- **Toast Notifications**
  - Success, error, info, warning types
  - Auto-dismiss after duration
  - Manual dismiss option

- **Dark/Light Mode**
  - System preference detection
  - Persistent theme selection
  - Smooth transitions

- **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop layouts
  - Tailwind CSS utility classes

## 🛠️ Tech Stack

- **Framework:** Vue 3.3+
- **Language:** TypeScript 5.3+
- **Build Tool:** Vite 5.0+
- **Styling:** Tailwind CSS 3.4+
- **Monorepo:** Turborepo 1.11+
- **State Management:**
  - Pinia 2.1+
  - Vuex 4.1+
  - RxJS 7.8+
- **HTTP Client:** Axios 1.6+
- **Testing:** Vitest 1.1+
- **API:** JSONPlaceholder (<https://jsonplaceholder.typicode.com>)

## 📊 Comparison

See [docs/comparison.md](./docs/comparison.md) for a detailed comparison of all state management patterns, including:

- Pros and Cons
- Boilerplate size
- Performance metrics
- Scalability considerations
- Learning curve
- Use case recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [JSONPlaceholder](https://jsonplaceholder.typicode.com) for the free fake REST API
- [Vue.js](https://vuejs.org/) team for the amazing framework
- [Turborepo](https://turbo.build/) for the monorepo tooling

---

### Built with ❤️ for the Vue.js community
