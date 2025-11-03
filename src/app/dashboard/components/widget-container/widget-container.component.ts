import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { Widget, WidgetType } from '../../../core/models/widget.model';
import { ProjectListWidgetComponent } from '../widgets/project-list-widget/project-list-widget.component';
import { ProjectStatsWidgetComponent } from '../widgets/project-stats-widget/project-stats-widget.component';
import { ProgressChartWidgetComponent } from '../widgets/progress-chart-widget/progress-chart-widget.component';
import { TimelineWidgetComponent } from '../widgets/timeline-widget/timeline-widget.component';
import { RealTimeUpdatesWidgetComponent } from '../widgets/real-time-updates-widget/real-time-updates-widget.component';

@Component({
  selector: 'app-widget-container',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    ProjectListWidgetComponent,
    ProjectStatsWidgetComponent,
    ProgressChartWidgetComponent,
    TimelineWidgetComponent,
    RealTimeUpdatesWidgetComponent
  ],
  templateUrl: './widget-container.component.html',
  styleUrl: './widget-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetContainerComponent {
  public readonly widget = input.required<Widget>();
  public readonly remove = output<string>();
  public readonly toggleVisibility = output<string>();

  protected readonly WidgetType = WidgetType;

  protected onRemove(): void {
    if (confirm(`Remove widget "${this.widget().title}"?`)) {
      this.remove.emit(this.widget().id);
    }
  }
}
