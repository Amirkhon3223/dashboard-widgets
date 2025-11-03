# Interactive Project Dashboard

Современный интерактивный дашборд для управления проектами с настраиваемыми виджетами, созданный с использованием Angular 20, PrimeNG и Chart.js.

![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![PrimeNG](https://img.shields.io/badge/PrimeNG-20.3-00897B)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384)

## Возможности

- **Настраиваемые виджеты**: добавление, удаление и перемещение виджетов на дашборде
- **Drag & Drop**: улучшенное перетаскивание виджетов с Flexbox layout - легко меняйте позиции карточек в любом направлении
- **Сохранение состояния**: автоматическое сохранение конфигурации дашборда в localStorage
- **Real-time обновления**: автоматическое обновление данных каждые 5 секунд
- **Интерактивные графики**: визуализация данных с помощью Chart.js
- **Responsive design**: адаптивный дизайн для всех устройств
- **Zoneless архитектура**: использование Angular 20 без ZoneJS для максимальной производительности
- **Signals**: реактивность на основе Angular Signals

## Технологический стек

### Core
- **Angular 20.3** - фреймворк для построения SPA
- **TypeScript 5.9** - типизированный JavaScript
- **RxJS 7.8** - реактивное программирование

### UI Библиотеки
- **PrimeNG 20.3** - UI компоненты
- **PrimeFlex 4.0** - CSS утилиты
- **PrimeIcons 7.0** - набор иконок
- **Chart.js 4.5** - библиотека для графиков

### Инструменты разработки
- **@angular/cdk** - Angular Component Dev Kit для drag & drop
- **SCSS** - препроцессор CSS для кастомных стилей

## Архитектура приложения

Проект использует **Feature-Sliced Design (FSD)** архитектуру:

```
src/
├── app/
│   ├── core/                          # Ядро приложения
│   │   ├── models/                    # Модели данных и интерфейсы
│   │   │   ├── project.model.ts       # Модель проекта
│   │   │   └── widget.model.ts        # Модель виджета
│   │   └── services/                  # Сервисы
│   │       ├── project.service.ts     # Управление проектами
│   │       └── dashboard-state.service.ts  # Управление состоянием дашборда
│   │
│   ├── dashboard/                     # Feature: Dashboard
│   │   ├── components/
│   │   │   ├── widget-container/      # Контейнер для виджетов
│   │   │   └── widgets/               # Виджеты
│   │   │       ├── project-stats-widget/        # Статистика проектов
│   │   │       ├── real-time-updates-widget/    # Real-time обновления
│   │   │       ├── project-list-widget/         # Список проектов
│   │   │       ├── progress-chart-widget/       # График прогресса
│   │   │       └── timeline-widget/             # Временная шкала
│   │   ├── dashboard.component.ts     # Главный компонент дашборда
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.scss
│   │
│   ├── app.ts                         # Корневой компонент
│   ├── app.config.ts                  # Конфигурация приложения
│   └── app.routes.ts                  # Маршрутизация
│
├── environments/                      # Конфигурация окружений
│   ├── environment.ts                 # Development
│   └── environment.prod.ts            # Production
│
└── styles.scss                        # Глобальные стили
```

### Ключевые архитектурные решения

#### 1. Signals вместо традиционного Change Detection

Используются Angular Signals для реактивности:

```typescript
// ProjectService
private projectsSignal = signal<Project[]>([]);
readonly stats = computed<ProjectStats>(() => {
  const projects = this.projectsSignal();
  // Вычисление статистики
});
```

#### 2. Zoneless Architecture

Приложение работает без ZoneJS благодаря `provideZonelessChangeDetection()`:

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    providePrimeNG({ theme: { preset: Aura } })
  ]
};
```

#### 3. Standalone Components

Все компоненты standalone, без необходимости в NgModule:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DragDropModule, ButtonModule, ...]
})
export class DashboardComponent { }
```

#### 4. Lazy Loading

Дашборд загружается лениво для оптимизации начальной загрузки:

```typescript
{
  path: 'dashboard',
  loadComponent: () =>
    import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
}
```

## Компоненты и виджеты

### 1. Project Stats Widget
Отображает статистику по всем проектам:
- Общее количество проектов
- Активные проекты
- Завершенные проекты
- Средний прогресс

### 2. Real-Time Updates Widget
Автоматически обновляется каждые 5 секунд:
- Отображает последние изменения в проектах
- Live индикатор
- История обновлений (последние 5)

### 3. Project List Widget
Список проектов с детальной информацией:
- Фильтрация по статусу
- Прогресс бар
- Информация о команде
- Оставшиеся дни до дедлайна

### 4. Progress Chart Widget
Визуализация прогресса проектов:
- Поддержка различных типов графиков (bar, line, doughnut, pie)
- Настраиваемая легенда
- Интерактивные подсказки

### 5. Timeline Widget
Временная шкала событий проектов:
- Даты начала и окончания
- Визуальные индикаторы
- Прошедшие и будущие события

## Сервисы

### ProjectService

Управляет данными проектов:

```typescript
// Асинхронная загрузка проектов
loadProjects(): void

// Real-time обновления
getRealTimeUpdates(): Observable<Project[]>

// Фильтрация
getProjectsByStatus(status: ProjectStatus): Project[]
```

### DashboardStateService

Управляет состоянием дашборда:

```typescript
// Сохранение/загрузка состояния
loadState(): void
saveState(): void

// Управление виджетами
updateWidgetOrder(widgets: Widget[]): void
toggleWidgetVisibility(widgetId: string): void
removeWidget(widgetId: string): void
```

## Использование AI в разработке

В процессе разработки активно использовался AI (Claude Code) для:

### 1. Генерация базовой структуры

AI помог создать FSD структуру проекта с правильной организацией папок и файлов

### 2. Создание анимаций

AI создал анимации для drag & drop, появления виджетов и интерактивных элементов

### 3. Дизайн и верстка

AI помог с адаптивным дизайном, стилями компонентов и CSS Grid layout

### 4. Документирование кода

AI добавил JSDoc комментарии к методам и классам для улучшения читаемости кода

### 5. Исправление багов

AI помог выявить и исправить проблему с отображением элементов в виджете Active Projects, связанную с несовместимостью PrimeNG DataView и Angular Signals при использовании OnPush стратегии. Решение: замена DataView на нативный цикл `@for`

## Установка и запуск

### Предварительные требования

- Node.js >= 18
- npm >= 9

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm start
```

Приложение будет доступно по адресу `http://localhost:4200/`

### Сборка для production

```bash
npm run build
```

Собранные файлы будут в папке `dist/interactive-dashboard/`

### Запуск тестов

```bash
npm test
```

## Оптимизации производительности
1. **Signals** - точечные обновления только измененных данных
2. **OnPush Strategy** - компоненты обновляются только при изменении входных данных
3. **Lazy Loading** - дашборд загружается по требованию
4. **shareReplay** - кеширование Observable результатов
5. **computed** - мемоизация вычисляемых значений
6. **CSS containment** - изоляция рендеринга виджетов

## Лицензия

MIT

## Автор

Амирхон Исомадинов
