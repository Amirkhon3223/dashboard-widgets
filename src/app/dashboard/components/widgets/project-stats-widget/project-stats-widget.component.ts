import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-project-stats-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-stats-widget.component.html',
  styleUrl: './project-stats-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectStatsWidgetComponent {
  private readonly projectService = inject(ProjectService);

  protected readonly stats = this.projectService.stats;
  protected readonly projects = this.projectService.projects;

  protected readonly pendingProjects = computed(() => {
    return this.projects().filter(p => p.status === 'Pending').length;
  });

  protected readonly onHoldProjects = computed(() => {
    return this.projects().filter(p => p.status === 'On Hold').length;
  });
}
