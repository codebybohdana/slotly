# Slotly — План розробки

Платформа бронювання послуг. Майстри створюють послуги і слоти, клієнти бронюють.

**Стек:** React + TypeScript + Tailwind / Node.js + Express + PostgreSQL / JWT

---

## Правила роботи

1. Один крок за раз — не рухаєшся далі поки не зрозуміла поточний
2. Кожен рядок коду пишеш сама
3. Коміт після кожного логічного кроку
4. Якщо щось незрозуміло — зупиняєшся і розбираєш перед тим як писати

---

## Структура проєкту

```
slotly/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── services.routes.js
│   │   │   ├── slots.routes.js
│   │   │   └── bookings.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── db/
│   │   │   ├── index.js
│   │   │   └── schema.sql
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Services.tsx
    │   │   ├── Bookings.tsx
    │   │   └── Dashboard.tsx
    │   ├── components/
    │   ├── api/
    │   │   └── index.ts
    │   └── App.tsx
    ├── .env
    └── package.json
```

---

## Схема бази даних

```sql
-- Користувачі (майстри і клієнти)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('master', 'client')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Послуги майстра
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- тривалість в хвилинах
  master_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Слоти доступності
CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  master_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Бронювання
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  slot_id INTEGER REFERENCES slots(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API ендпоінти

```
AUTH
POST   /api/auth/register     реєстрація
POST   /api/auth/login        логін

SERVICES
GET    /api/services          всі послуги (публічно)
GET    /api/services/:id      одна послуга
POST   /api/services          створити (тільки майстер)
PUT    /api/services/:id      оновити (тільки майстер)
DELETE /api/services/:id      видалити (тільки майстер)

SLOTS
GET    /api/slots?service_id=1   вільні слоти для послуги
POST   /api/slots                створити слот (тільки майстер)
DELETE /api/slots/:id            видалити слот (тільки майстер)

BOOKINGS
GET    /api/bookings             мої бронювання
POST   /api/bookings             створити бронювання
DELETE /api/bookings/:id         скасувати бронювання
```

---

## Тиждень 1 — Бекенд

### День 1 — Сервер

- [ ] Структура папок backend/
- [ ] Встановити залежності (express, pg, dotenv, bcrypt, jsonwebtoken, cors)
- [ ] Написати server.js з одним тестовим ендпоінтом GET /health
- [ ] Запустити і перевірити в браузері
- [ ] Перший коміт

### День 2 — База даних

- [ ] Створити базу slotly_db в PostgreSQL
- [ ] Написати schema.sql з усіма таблицями
- [ ] Підключити PostgreSQL через pg в db/index.js
- [ ] Перевірити підключення
- [ ] Коміт

### День 3 — Реєстрація і логін

- [ ] POST /api/auth/register
  - [ ] Валідація даних
  - [ ] Хешування паролю (bcrypt)
  - [ ] Запис в базу
  - [ ] Повернути токен
- [ ] POST /api/auth/login
  - [ ] Знайти юзера в базі
  - [ ] Порівняти паролі (bcrypt.compare)
  - [ ] Створити JWT токен
  - [ ] Повернути токен
- [ ] Коміт

### День 4 — Middleware

- [ ] Написати authMiddleware
  - [ ] Перевірити наявність токена
  - [ ] Верифікувати JWT
  - [ ] Покласти req.user
  - [ ] next() або 401
- [ ] Написати roleMiddleware
  - [ ] Перевірити role з req.user
  - [ ] next() або 403
- [ ] Коміт

### День 5 — Послуги

- [ ] GET /api/services — всі послуги з іменем майстра (JOIN)
- [ ] GET /api/services/:id — одна послуга
- [ ] POST /api/services — створити (authMiddleware + роль master)
- [ ] PUT /api/services/:id — оновити
- [ ] DELETE /api/services/:id — видалити
- [ ] Коміт

### День 6 — Слоти

- [ ] POST /api/slots — створити слот
- [ ] GET /api/slots?service_id=1 — вільні слоти
- [ ] DELETE /api/slots/:id — видалити слот
- [ ] Коміт

### День 7 — Бронювання

- [ ] POST /api/bookings
  - [ ] Перевірити чи слот вільний
  - [ ] Створити бронювання
  - [ ] Позначити слот як зайнятий (is_available = false)
  - [ ] Все в транзакції
- [ ] GET /api/bookings — мої бронювання
- [ ] DELETE /api/bookings/:id — скасувати
- [ ] Коміт

---

## Тиждень 2 — Фронтенд

### День 8 — React структура

- [ ] Створити Vite + React + TypeScript проєкт
- [ ] Встановити Tailwind CSS
- [ ] Встановити React Router
- [ ] Створити структуру сторінок
- [ ] Коміт

### День 9 — Авторизація

- [ ] Сторінка реєстрації (форма + fetch)
- [ ] Сторінка логіну (форма + fetch)
- [ ] Зберегти токен в localStorage
- [ ] Захищені роути (якщо нема токена — редірект)
- [ ] Коміт

### День 10 — Каталог послуг

- [ ] Сторінка зі списком послуг (fetch + useState + useEffect)
- [ ] Картка послуги
- [ ] Сторінка однієї послуги
- [ ] Коміт

### День 11 — Бронювання

- [ ] Список вільних слотів
- [ ] Кнопка «Забронювати»
- [ ] Підтвердження бронювання
- [ ] Коміт

### День 12 — Особисті кабінети

- [ ] Клієнт: мої бронювання + скасування
- [ ] Майстер: мої послуги + додати нову
- [ ] Коміт

### День 13 — Деплой

- [ ] .env на беку і фронті
- [ ] CORS налаштування
- [ ] Деплой бекенду на Railway
- [ ] Деплой фронтенду на Vercel
- [ ] Перевірити що все працює онлайн
- [ ] Коміт

### День 14 — Фінал

- [ ] README з описом проєкту і скріншотами
- [ ] Перевірити весь функціонал
- [ ] Портфоліо готове

---

## Що вивчиш в процесі

```
Express сервер з нуля
PostgreSQL підключення і SQL запити
Схема бази і звʼязки між таблицями
JOIN запити
Транзакції (бронювання)
bcrypt — хешування паролів
JWT — створення і перевірка токенів
Middleware — авторизація і ролі
Валідація даних
React useState і useEffect
React Router
fetch з токеном
Tailwind CSS
CORS
.env змінні
Деплой Railway + Vercel
Git — коміти, структура
```

---

## Корисні команди

```bash
# Бекенд
cd backend
npm run dev          # запустити сервер

# Фронтенд
cd frontend
npm run dev          # запустити React

# PostgreSQL
psql -U postgres
\c slotly_db         # підключитись до бази
\dt                  # список таблиць

# Git
git add .
git commit -m "feat: назва що зробила"
git push
```

---

## Конвенція комітів

```
feat:     нова функціональність
fix:      виправлення помилки
refactor: зміна коду без нової функціональності
docs:     зміни в документації
chore:    налаштування, залежності
```

Приклади:

````
feat: add user registration endpoint
feat: add JWT middleware
feat: add services CRUD
fix: fix slot conflict check
```# Slotly — План розробки

Платформа бронювання послуг. Майстри створюють послуги і слоти, клієнти бронюють.

**Стек:** React + TypeScript + Tailwind / Node.js + Express + PostgreSQL / JWT

---

## Правила роботи

1. Один крок за раз — не рухаєшся далі поки не зрозуміла поточний
2. Кожен рядок коду пишеш сама
3. Коміт після кожного логічного кроку
4. Якщо щось незрозуміло — зупиняєшся і розбираєш перед тим як писати

---

## Структура проєкту

````

slotly/
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ │ ├── auth.routes.js
│ │ │ ├── services.routes.js
│ │ │ ├── slots.routes.js
│ │ │ └── bookings.routes.js
│ │ ├── middleware/
│ │ │ └── auth.middleware.js
│ │ ├── db/
│ │ │ ├── index.js
│ │ │ └── schema.sql
│ │ └── server.js
│ ├── .env
│ ├── .gitignore
│ └── package.json
│
└── frontend/
├── src/
│ ├── pages/
│ │ ├── Home.tsx
│ │ ├── Login.tsx
│ │ ├── Register.tsx
│ │ ├── Services.tsx
│ │ ├── Bookings.tsx
│ │ └── Dashboard.tsx
│ ├── components/
│ ├── api/
│ │ └── index.ts
│ └── App.tsx
├── .env
└── package.json

````

---

## Схема бази даних

```sql
-- Користувачі (майстри і клієнти)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('master', 'client')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Послуги майстра
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- тривалість в хвилинах
  master_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Слоти доступності
CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  master_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Бронювання
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  slot_id INTEGER REFERENCES slots(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW()
);
````

---

## API ендпоінти

```
AUTH
POST   /api/auth/register     реєстрація
POST   /api/auth/login        логін

SERVICES
GET    /api/services          всі послуги (публічно)
GET    /api/services/:id      одна послуга
POST   /api/services          створити (тільки майстер)
PUT    /api/services/:id      оновити (тільки майстер)
DELETE /api/services/:id      видалити (тільки майстер)

SLOTS
GET    /api/slots?service_id=1   вільні слоти для послуги
POST   /api/slots                створити слот (тільки майстер)
DELETE /api/slots/:id            видалити слот (тільки майстер)

BOOKINGS
GET    /api/bookings             мої бронювання
POST   /api/bookings             створити бронювання
DELETE /api/bookings/:id         скасувати бронювання
```

---

## Тиждень 1 — Бекенд

### День 1 — Сервер

- [ ] Структура папок backend/
- [ ] Встановити залежності (express, pg, dotenv, bcrypt, jsonwebtoken, cors)
- [ ] Написати server.js з одним тестовим ендпоінтом GET /health
- [ ] Запустити і перевірити в браузері
- [ ] Перший коміт

### День 2 — База даних

- [ ] Створити базу slotly_db в PostgreSQL
- [ ] Написати schema.sql з усіма таблицями
- [ ] Підключити PostgreSQL через pg в db/index.js
- [ ] Перевірити підключення
- [ ] Коміт

### День 3 — Реєстрація і логін

- [ ] POST /api/auth/register
  - [ ] Валідація даних
  - [ ] Хешування паролю (bcrypt)
  - [ ] Запис в базу
  - [ ] Повернути токен
- [ ] POST /api/auth/login
  - [ ] Знайти юзера в базі
  - [ ] Порівняти паролі (bcrypt.compare)
  - [ ] Створити JWT токен
  - [ ] Повернути токен
- [ ] Коміт

### День 4 — Middleware

- [ ] Написати authMiddleware
  - [ ] Перевірити наявність токена
  - [ ] Верифікувати JWT
  - [ ] Покласти req.user
  - [ ] next() або 401
- [ ] Написати roleMiddleware
  - [ ] Перевірити role з req.user
  - [ ] next() або 403
- [ ] Коміт

### День 5 — Послуги

- [ ] GET /api/services — всі послуги з іменем майстра (JOIN)
- [ ] GET /api/services/:id — одна послуга
- [ ] POST /api/services — створити (authMiddleware + роль master)
- [ ] PUT /api/services/:id — оновити
- [ ] DELETE /api/services/:id — видалити
- [ ] Коміт

### День 6 — Слоти

- [ ] POST /api/slots — створити слот
- [ ] GET /api/slots?service_id=1 — вільні слоти
- [ ] DELETE /api/slots/:id — видалити слот
- [ ] Коміт

### День 7 — Бронювання

- [ ] POST /api/bookings
  - [ ] Перевірити чи слот вільний
  - [ ] Створити бронювання
  - [ ] Позначити слот як зайнятий (is_available = false)
  - [ ] Все в транзакції
- [ ] GET /api/bookings — мої бронювання
- [ ] DELETE /api/bookings/:id — скасувати
- [ ] Коміт

---

## Тиждень 2 — Фронтенд

### День 8 — React структура

- [ ] Створити Vite + React + TypeScript проєкт
- [ ] Встановити Tailwind CSS
- [ ] Встановити React Router
- [ ] Створити структуру сторінок
- [ ] Коміт

### День 9 — Авторизація

- [ ] Сторінка реєстрації (форма + fetch)
- [ ] Сторінка логіну (форма + fetch)
- [ ] Зберегти токен в localStorage
- [ ] Захищені роути (якщо нема токена — редірект)
- [ ] Коміт

### День 10 — Каталог послуг

- [ ] Сторінка зі списком послуг (fetch + useState + useEffect)
- [ ] Картка послуги
- [ ] Сторінка однієї послуги
- [ ] Коміт

### День 11 — Бронювання

- [ ] Список вільних слотів
- [ ] Кнопка «Забронювати»
- [ ] Підтвердження бронювання
- [ ] Коміт

### День 12 — Особисті кабінети

- [ ] Клієнт: мої бронювання + скасування
- [ ] Майстер: мої послуги + додати нову
- [ ] Коміт

### День 13 — Деплой

- [ ] .env на беку і фронті
- [ ] CORS налаштування
- [ ] Деплой бекенду на Railway
- [ ] Деплой фронтенду на Vercel
- [ ] Перевірити що все працює онлайн
- [ ] Коміт

### День 14 — Фінал

- [ ] README з описом проєкту і скріншотами
- [ ] Перевірити весь функціонал
- [ ] Портфоліо готове

---

## Що вивчиш в процесі

```
Express сервер з нуля
PostgreSQL підключення і SQL запити
Схема бази і звʼязки між таблицями
JOIN запити
Транзакції (бронювання)
bcrypt — хешування паролів
JWT — створення і перевірка токенів
Middleware — авторизація і ролі
Валідація даних
React useState і useEffect
React Router
fetch з токеном
Tailwind CSS
CORS
.env змінні
Деплой Railway + Vercel
Git — коміти, структура
```

---

## Корисні команди

```bash
# Бекенд
cd backend
npm run dev          # запустити сервер

# Фронтенд
cd frontend
npm run dev          # запустити React

# PostgreSQL
psql -U postgres
\c slotly_db         # підключитись до бази
\dt                  # список таблиць

# Git
git add .
git commit -m "feat: назва що зробила"
git push
```

---

## Конвенція комітів

```
feat:     нова функціональність
fix:      виправлення помилки
refactor: зміна коду без нової функціональності
docs:     зміни в документації
chore:    налаштування, залежності
```

Приклади:

```
feat: add user registration endpoint
feat: add JWT middleware
feat: add services CRUD
fix: fix slot conflict check
```
