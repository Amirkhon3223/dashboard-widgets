import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { DashboardStateService } from '../core/services/dashboard-state.service';
import { ProjectService } from '../core/services/project.service';
import { Widget, WidgetType } from '../core/models/widget.model';
import { WidgetContainerComponent } from './components/widget-container/widget-container.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule,
    DragDropModule,
    DialogModule,
    Select,
    InputTextModule,
    FormsModule,
    WidgetContainerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly dashboardStateService = inject(DashboardStateService);
  private readonly projectService = inject(ProjectService);

  protected readonly widgets = this.dashboardStateService.widgets;
  protected readonly projects = this.projectService.projects;
  protected readonly stats = this.projectService.stats;

  protected readonly showAddWidgetDialog = signal(false);

  protected newWidget = {
    type: WidgetType.PROJECT_STATS,
    title: ''
  };

  protected readonly widgetTypes = [
    { label: 'Project Statistics', value: WidgetType.PROJECT_STATS },
    { label: 'Real-Time Updates', value: WidgetType.REAL_TIME_UPDATES },
    { label: 'Project List', value: WidgetType.PROJECT_LIST },
    { label: 'Progress Chart', value: WidgetType.PROGRESS_CHART },
    { label: 'Timeline', value: WidgetType.TIMELINE }
  ];

  private autoScrollInterval?: number;
  private previousWidgetCount = 0;

  constructor() {
    effect(() => {
      const widgetCount = this.widgets().length;
      const visibleCount = this.widgets().filter(w => w.visible).length;
      console.log(`Widgets: ${visibleCount}/${widgetCount} visible`);

      if (widgetCount > this.previousWidgetCount) {
        const container = document.querySelector('.dashboard-content') as HTMLElement;
        if (container) {
          requestAnimationFrame(() => {
            container.scrollTo({
              left: container.scrollWidth,
              behavior: 'smooth'
            });
          });
        }
      }
      this.previousWidgetCount = widgetCount;
    });

    effect(() => {
      const currentStats = this.stats();
      console.log('Project stats updated:', currentStats);
    });
  }

  protected drop(event: CdkDragDrop<Widget[]>): void {
    this.stopAutoScroll();

    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const visibleWidgets = [...this.getVisibleWidgets()];
    moveItemInArray(visibleWidgets, event.previousIndex, event.currentIndex);
    this.dashboardStateService.updateWidgetOrder(visibleWidgets);

    console.log('Widget reordered:', {
      from: event.previousIndex,
      to: event.currentIndex,
      widget: visibleWidgets[event.currentIndex].title
    });
  }

  protected onDragMoved(event: any): void {
    const container = document.querySelector('.dashboard-content') as HTMLElement;
    if (!container) return;

    const pointerPosition = event.pointerPosition;
    const containerRect = container.getBoundingClientRect();
    const scrollThreshold = 100;
    const scrollSpeed = 15;

    if (pointerPosition.x < containerRect.left + scrollThreshold) {
      this.startAutoScroll(container, -scrollSpeed);
    } else if (pointerPosition.x > containerRect.right - scrollThreshold) {
      this.startAutoScroll(container, scrollSpeed);
    } else {
      this.stopAutoScroll();
    }
  }

  private startAutoScroll(container: HTMLElement, speed: number): void {
    if (this.autoScrollInterval) return;

    this.autoScrollInterval = window.setInterval(() => {
      container.scrollLeft += speed;
    }, 16);
  }

  private stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = undefined;
    }
  }

  /**
   * Получает только видимые виджеты
   */
  protected getVisibleWidgets(): Widget[] {
    return this.dashboardStateService.getVisibleWidgets();
  }

  /**
   * Переключает видимость виджета
   */
  protected toggleWidgetVisibility(widgetId: string): void {
    this.dashboardStateService.toggleWidgetVisibility(widgetId);
  }

  /**
   * Удаляет виджет
   */
  protected removeWidget(widgetId: string): void {
    this.dashboardStateService.removeWidget(widgetId);
  }

  /**
   * Сбрасывает дашборд к настройкам по умолчанию
   */
  protected resetDashboard(): void {
    if (confirm('Are you sure you want to reset the dashboard to default settings? This will clear all localStorage data.')) {
      this.dashboardStateService.clearState();
      this.dashboardStateService.resetToDefault();
      window.location.reload();
    }
  }


  /**
   * Открывает диалог добавления виджета
   */
  protected openAddWidgetDialog(): void {
    this.newWidget = {
      type: WidgetType.PROJECT_STATS,
      title: ''
    };
    this.showAddWidgetDialog.set(true);
  }

  /**
   * Добавляет новый виджет
   */
  protected addWidget(): void {
    if (!this.newWidget.title.trim()) {
      return;
    }

    this.dashboardStateService.addWidget({
      type: this.newWidget.type,
      title: this.newWidget.title,
      visible: true,
      config: this.getDefaultConfigForType(this.newWidget.type)
    });

    this.showAddWidgetDialog.set(false);
  }

  /**
   * Возвращает конфигурацию по умолчанию для типа виджета
   */
  private getDefaultConfigForType(type: WidgetType): any {
    switch (type) {
      case WidgetType.REAL_TIME_UPDATES:
        return { refreshInterval: 5000 };
      case WidgetType.PROJECT_LIST:
        return { filters: { status: [] } };
      case WidgetType.PROGRESS_CHART:
        return { chartType: 'bar', showLegend: true };
      default:
        return {};
    }
  }
}
