TKD — система управления соревнованиями по тхэквондо. Веб-приложение для организации и проведения турниров, управления участниками, категориями и дисциплинами.


https://github.com/user-attachments/assets/09c83939-62f2-4e93-9918-2649510cf0b8


## 🏗️ Архитектура

**Frontend:**
- React 19
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4 + shadcn/ui (Radix UI)
- TanStack Query — управление состоянием сервера
- TanStack Table — таблицы
- Socket.IO Client — real-time обновления
- @dnd-kit — drag-and-drop

**Backend:**
- NestJS
- TypeORM + PostgreSQL 17
- JWT аутентификация
- Socket.IO — WebSocket соединения
- bcrypt — хеширование паролей
- class-validator — валидация данных

**Инфраструктура:**
- Docker + Docker Compose (4 сервиса: frontend, backend, db, nginx)
- Nginx — reverse proxy с SSL
- PostgreSQL — хранение данных

## 🔑 Основные возможности

- 🏆 Управление турнирами, соревнованиями и категориями
- 👥 Ролевая модель (Admin, Editor)
- 🥋 Управление дисциплинами и аренами
- 🔄 Real-time обновления через WebSocket
- 🔐 JWT аутентификация
- 📊 Dashboard для управления данными
