import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProjectService } from '../../../../core/services/project.service';
import { Project, ProjectStatus } from '../../../../core/models/project.model';

interface TimelineEvent {
  project: Project;
  date: Date;
  type: 'start' | 'end' | 'milestone';
  status: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-timeline-widget',
  standalone: true,
  imports: [CommonModule, TimelineModule, CardModule, TagModule],
  templateUrl: './timeline-widget.component.html',
  styleUrl: './timeline-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineWidgetComponent {
  private readonly projectService = inject(ProjectService);

  protected readonly projects = this.projectService.projects;

  protected readonly timelineEvents = computed<TimelineEvent[]>(() => {
    const projects = this.projects();
    const events: TimelineEvent[] = [];

    projects.forEach(project => {
      events.push({
        project,
        date: new Date(project.startDate),
        type: 'start',
        status: 'Started',
        icon: 'pi pi-play',
        color: '#4299e1'
      });

      events.push({
        project,
        date: new Date(project.endDate),
        type: 'end',
        status: project.status === ProjectStatus.COMPLETED ? 'Completed' : 'Deadline',
        icon: project.status === ProjectStatus.COMPLETED ? 'pi pi-check' : 'pi pi-flag',
        color: project.status === ProjectStatus.COMPLETED ? '#48bb78' : '#ed8936'
      });
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  protected getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warn';
      case 'Completed':
        return 'info';
      case 'On Hold':
        return 'danger';
      default:
        return 'info';
    }
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  protected isUpcoming(date: Date): boolean {
    return date.getTime() > new Date().getTime();
  }

  protected isPast(date: Date): boolean {
    return date.getTime() < new Date().getTime();
  }
}
