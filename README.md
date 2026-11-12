# SeconDrive.by - Онлайн-аукцион автомобилей

Современная B2B/B2C платформа онлайн-аукционов автомобилей с пробегом и повреждениями в Республике Беларусь (расчеты в BYN). Проект спроектирован с упором на реактивную архитектуру, высокую производительность рендеринга (`OnPush` + Angular Signals) и поддержку Server-Side Rendering (SSR).

---

## Технологический стек

- **Framework:** Angular (Standalone API, Signals, Новый Control Flow `@if` / `@for`, `withComponentInputBinding`)
- **State & Reactivity:**
  - **Angular Signals (`signal`, `computed`, `effect`, `input`, `output`)** - синхронное состояние UI и деривация данных без лишних циклов проверки изменений.
  - **RxJS** - асинхронные потоки данных, сетевые запросы, очереди авторизации, таймеры реального времени и потоки ставок.
- **SSR & Hydration:** `@angular/ssr` (Express-сервер, неразрушающая клиентская гидратация `provideClientHydration()`, безопасная работа с браузерными API через `PLATFORM_ID` и `isPlatformBrowser`).
- **UI & Styling:** Tailwind CSS, Taiga UI v5, кастомная типографика белорусского рубля (NBRB), GPU-ускоренные анимации.
- **Code Quality:** TypeScript (Strict Mode), Prettier (`prettier-plugin-tailwindcss`), Conventional Commits.

---

## Ключевые архитектурные решения

1. **Строгая изоляция Change Detection (`ChangeDetectionStrategy.OnPush`):**
   Все компоненты приложения работают в режиме `OnPush` и используют `standalone: true`. Обновление представлений происходит точечно через сигналы и `AsyncPipe`.
2. **Продвинутый Dependency Injection:**
   - Типизированная конфигурация окружения через `InjectionToken<ApiConfig>`.
   - Разделение областей видимости сервисов: глобальные синглтоны (`providedIn: 'root'`) для бизнес-данных и локальные инстансы на уровне компонентов (`providers: [LotTimerService]`) для изолированных таймеров обратного отсчета каждого лота.
3. **Функциональный JWT Interceptor с защитой от Race Condition:**
   - Автоматическая подстановка `Bearer` токена.
   - Перехват ошибок `401 Unauthorized` с постановкой параллельных запросов в реактивную очередь на базе `BehaviorSubject`, `filter`, `take(1)` и `switchMap` на время обновления токена (`refreshToken`).
4. **Доменная логика аукциона:**
   - Поддержка полного жизненного цикла торгов: `upcoming` (ожидает старта), `active` (идут торги), `finished` (завершен), `sold` (продан), `cancelled` (отменен).
   - Механика **Anti-Sniper** (автоматическое продление таймера при ставке на последних минутах).
   - Верификация участников (KYC) и гарантийный холд депозита (10% от стартовой цены лота).

---

## Архитектура проекта (`frontend/src/app`)

```text
src/app/
├── core/                  # Ядро приложения и бизнес-логика
│   ├── api/               # InjectionTokens и настройки API
│   ├── guards/            # Функциональные роут-гарды (CanActivateFn)
│   ├── interceptors/      # HTTP-интерсепторы (JWT + 401 Refresh Queue)
│   ├── mock/              # Моки данных аукциона и пользователей
│   ├── models/            # Доменные интерфейсы и DTO (Lot, LotDetails, User, Auth)
│   └── services/          # Сервисы (AuthService, LotsService, LotTimerService)
├── features/              # Фича-модули (Lazy Loaded)
│   ├── auction/           # Детальная страница лота, галерея, ТТХ, блок торгов
│   ├── catalog/           # Каталог активных и завершенных аукционов
│   ├── profile/           # Личный кабинет, KYC статус, избранные лоты
│   ├── admin/             # Панель создания и управления лотами
│   ├── about/             # О платформе
│   ├── rules/             # Правила проведения торгов
│   └── not-found/         # Страница 404
├── layout/                # Каркас приложения (Header с динамическим Sliding Pill на Signals)
└── shared/                # Переиспользуемые UI-компоненты, пайпы и директивы
    └── components/        # LotCard, LotStatusBadge, Currency, FavoriteButton
```

---

## Быстрый старт

### Требования
- **Node.js:** v18.19+ или v20+
- **npm:** v9+

### Установка и запуск (Frontend)

```bash
# Переход в директорию фронтенда
cd frontend

# Установка зависимостей
npm install

# Запуск dev-сервера (http://localhost:4200)
npm start
```

### Сборка и SSR

```bash
# Production-сборка (Browser + Server bundles + Prerendering)
npm run build

# Запуск собранного SSR-сервера
npm run serve:ssr:auction-web

# Форматирование кода
npm run format

# Запуск Unit-тестов
npm test
```
