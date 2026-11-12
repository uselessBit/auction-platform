# SeconDrive.by - Frontend (Angular)

Клиентская часть онлайн-аукциона автомобилей с повреждениями **SeconDrive.by**.

## Стек и ключевые технологии

- **Angular** (`standalone: true`, `ChangeDetectionStrategy.OnPush`, Signals, `@angular/core/rxjs-interop`)
- **Server-Side Rendering (SSR):** `@angular/ssr` + Client Hydration + SSR-safe работа с таймерами и хранилищем (`isPlatformBrowser`)
- **Стилизация и UI:** Tailwind CSS, Taiga UI v5, кастомный шрифт знака белорусского рубля (NBRB)
- **Маршрутизация:** Lazy Loading (`loadComponent`, `loadChildren`), `withComponentInputBinding()`, функциональные `CanActivateFn` гарды
- **Сеть и безопасность:** Функциональный `HttpInterceptorFn` с реактивной очередью запросов на `BehaviorSubject` при обновлении истекшего `accessToken`

## Структура директорий

- `src/app/core/` - доменные модели (`Lot`, `LotDetails`, `User`), глобальные и локальные сервисы (`LotsService`, `AuthService`, `LotTimerService`), токены DI (`API_CONFIG`), гарды и интерсепторы.
- `src/app/features/` - лениво загружаемые страницы: каталог (`catalog`), завершенные торги (`ended-catalog`), карточка лота (`auction/lot-details`), профиль (`profile`), создание лота (`admin/lot-create`).
- `src/app/layout/` - шапка приложения с вычисляемым индикатором активной вкладки (Sliding Pill) на сигналах.
- `src/app/shared/` - переиспользуемые презентационные компоненты (`LotCardComponent`, `LotStatusBadgeComponent`, `CurrencyComponent`, `FavoriteButtonComponent`).

## Команды

| Команда | Описание |
| :--- | :--- |
| `npm start` | Запуск dev-сервера на `http://localhost:4200/` |
| `npm run build` | Production-сборка клиентского и SSR бандлов в `dist/auction-web` |
| `npm run serve:ssr:auction-web` | Запуск Node.js Express SSR-сервера |
| `npm test` | Запуск unit-тестов через Karma / Jasmine |
| `npm run format` | Форматирование кода (`Prettier` + `prettier-plugin-tailwindcss`) |
