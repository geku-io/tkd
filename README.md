TKD — система управления соревнованиями по тхэквондо. Веб-приложение для организации и проведения турниров, управления участниками, категориями и дисциплинами.


https://github.com/user-attachments/assets/7b42f4e7-e0df-4790-a337-51605a113b8d


Архитектура:
Frontend
  -React 19
  -Next.js 16 (App Router, React 19)
  -TypeScript
  -TypeScript
  -Tailwind CSS v4 + shadcn/ui (Radix UI)
  -TanStack Query для управления состоянием сервера
  -TanStack Table для таблиц
  -Socket.IO Client для real-time обновлений
  -@dnd-kit для drag-and-drop
Backend
  -NestJS
  -TypeORM + PostgreSQL 17
  -JWT аутентификация
  -Socket.IO для WebSocket соединений
  -bcrypt для хеширования паролей
  -class-validator для валидации данных
Инфраструктура
Docker + Docker Compose (4 сервиса: frontend, backend, db, nginx)
Nginx как reverse proxy с SSL (gekuio.ru)
PostgreSQL для хранения данных

Основные возможности:
🏆 Управление турнирами, соревнованиями и категориями
👥 Ролевая модель (Admin, Editor)
🥋 Управление дисциплинами и аренами
🔄 Real-time обновления через WebSocket
🔐 JWT аутентификация
📊 Dashboard для управления данными
