import { Injectable, signal } from '@angular/core';
import { Widget, WidgetType, DashboardState } from '../models/widget.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  private readonly STORAGE_KEY = 'dashboard_state';
  private widgetsSignal = signal<Widget[]>([]);

  public readonly widgets = this.widgetsSignal.asReadonly();

  constructor() {
    this.loadState();
  }

  /**
   * Инициализирует дашборд с виджетами по умолчанию
   */
  private initializeDefaultWidgets(): Widget[] {
    return [
      {
        id: 'widget-1',
        type: WidgetType.PROJECT_STATS,
        title: 'Project Statistics',
        order: 0,
        visible: true,
        config: {}
      },
      {
        id: 'widget-2',
        type: WidgetType.REAL_TIME_UPDATES,
        title: 'Real-Time Updates',
        order: 1,
        visible: true,
        config: {
          refreshInterval: 5000
        }
      },
      {
        id: 'widget-3',
        type: WidgetType.PROJECT_LIST,
        title: 'Active Projects',
        order: 2,
        visible: true,
        config: {
          filters: {
            status: ['Active']
          }
        }
      },
      {
        id: 'widget-4',
        type: WidgetType.PROGRESS_CHART,
        title: 'Progress Overview',
        order: 3,
        visible: true,
        config: {
          chartType: 'bar',
          showLegend: true
        }
      },
      {
        id: 'widget-5',
        type: WidgetType.TIMELINE,
        title: 'Project Timeline',
        order: 4,
        visible: true,
        config: {}
      }
    ];
  }

  /**
   * Загружает состояние дашборда из localStorage
   */
  private loadState(): void {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);

      if (savedState) {
        const state: DashboardState = JSON.parse(savedState);
        this.widgetsSignal.set(state.widgets);
        console.log('Dashboard state loaded from localStorage');
      } else {
        const defaultWidgets = this.initializeDefaultWidgets();
        this.widgetsSignal.set(defaultWidgets);
        this.saveState();
        console.log('Initialized with default widgets');
      }
    } catch (error) {
      console.error('Error loading dashboard state:', error);
      this.widgetsSignal.set(this.initializeDefaultWidgets());
    }
  }

  /**
   * Сохраняет текущее состояние дашборда в localStorage
   */
  private saveState(): void {
    try {
      const state: DashboardState = {
        widgets: this.widgetsSignal(),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      console.log('Dashboard state saved to localStorage');
    } catch (error) {
      console.error('Error saving dashboard state:', error);
    }
  }

  /**
   * Обновляет порядок виджетов после drag & drop
   * Принимает только видимые виджеты в новом порядке
   */
  public updateWidgetOrder(reorderedVisibleWidgets: Widget[]): void {
    const allWidgets = this.widgetsSignal();

    const newOrderMap = new Map<string, number>();
    reorderedVisibleWidgets.forEach((widget, index) => {
      newOrderMap.set(widget.id, index);
    });

    const updatedWidgets = allWidgets.map(widget => {
      if (newOrderMap.has(widget.id)) {
        return {
          ...widget,
          order: newOrderMap.get(widget.id)!
        };
      }
      return widget;
    });

    this.widgetsSignal.set(updatedWidgets);
    this.saveState();
  }

  /**
   * Переключает видимость виджета
   */
  public toggleWidgetVisibility(widgetId: string): void {
    const widgets = this.widgetsSignal();
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, visible: !widget.visible }
        : widget
    );
    this.widgetsSignal.set(updatedWidgets);
    this.saveState();
  }

  /**
   * Добавляет новый виджет
   */
  public addWidget(widget: Omit<Widget, 'id' | 'order'>): void {
    const widgets = this.widgetsSignal();
    const newWidget: Widget = {
      ...widget,
      id: `widget-${Date.now()}`,
      order: widgets.length
    };
    this.widgetsSignal.set([...widgets, newWidget]);
    this.saveState();
  }

  /**
   * Удаляет виджет
   */
  public removeWidget(widgetId: string): void {
    const widgets = this.widgetsSignal();
    const filteredWidgets = widgets
      .filter(w => w.id !== widgetId)
      .map((w, index) => ({ ...w, order: index }));
    this.widgetsSignal.set(filteredWidgets);
    this.saveState();
  }

  /**
   * Обновляет конфигурацию виджета
   */
  public updateWidgetConfig(widgetId: string, config: Widget['config']): void {
    const widgets = this.widgetsSignal();
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, config: { ...widget.config, ...config } }
        : widget
    );
    this.widgetsSignal.set(updatedWidgets);
    this.saveState();
  }

  /**
   * Сбрасывает дашборд к настройкам по умолчанию
   */
  public resetToDefault(): void {
    this.widgetsSignal.set(this.initializeDefaultWidgets());
    this.saveState();
  }

  /**
   * Очищает сохраненное состояние
   */
  public clearState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Dashboard state cleared');
  }

  /**
   * Получает видимые виджеты, отсортированные по порядку
   */
  public getVisibleWidgets(): Widget[] {
    return this.widgetsSignal()
      .filter(w => w.visible)
      .sort((a, b) => a.order - b.order);
  }
}
