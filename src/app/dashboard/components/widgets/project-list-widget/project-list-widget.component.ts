import { Component, inject, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from '../../../../core/services/project.service';
import { Project, ProjectStatus } from '../../../../core/models/project.model';
import { WidgetConfig } from '../../../../core/models/widget.model';

@Component({
  selector: 'app-project-list-widget',
  standalone: true,
  imports: [CommonModule, TagModule, ProgressBarModule, ButtonModule],
  templateUrl: './project-list-widget.component.html',
  styleUrl: './project-list-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListWidgetComponent {
  private readonly projectService = inject(ProjectService);

  public readonly config = input<WidgetConfig>();

  protected readonly filteredProjects = computed(() => {
    const allProjects = this.projectService.projects();
    const filters = this.config()?.filters;

    if (!filters?.status || filters.status.length === 0) {
      return allProjects;
    }

    return allProjects.filter(project => filters.status?.includes(project.status));
  });

  protected getStatusSeverity(status: ProjectStatus): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'success';
      case ProjectStatus.PENDING:
        return 'warn';
      case ProjectStatus.COMPLETED:
        return 'info';
      case ProjectStatus.ON_HOLD:
        return 'danger';
      default:
        return 'info';
    }
  }

  protected getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  protected getProgressColor(progress: number): string {
    if (progress >= 80) return '#48bb78';
    if (progress >= 50) return '#4299e1';
    if (progress >= 25) return '#ed8936';
    return '#f56565';
  }
}
