import { Component, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { ProjectService } from '../../../../core/services/project.service';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-real-time-updates-widget',
  standalone: true,
  imports: [CommonModule, ProgressBarModule, BadgeModule],
  templateUrl: './real-time-updates-widget.component.html',
  styleUrl: './real-time-updates-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealTimeUpdatesWidgetComponent implements OnInit, OnDestroy {
  private readonly projectService = inject(ProjectService);
  private subscription?: Subscription;

  protected readonly lastUpdate = signal<Date>(new Date());
  protected readonly recentUpdates = signal<Array<{ project: Project; timestamp: Date }>>([]);

  public ngOnInit(): void {
    this.subscription = this.projectService.getRealTimeUpdates().subscribe(updatedProjects => {
      this.projectService.updateProjects(updatedProjects);
      this.lastUpdate.set(new Date());

      const activeProjects = updatedProjects.filter(p => p.status === 'Active');
      if (activeProjects.length > 0) {
        const updates = activeProjects.map(project => ({
          project,
          timestamp: new Date()
        }));

        this.recentUpdates.update(current => {
          const combined = [...updates, ...current];
          return combined.slice(0, 5);
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

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

  protected getTimeSinceUpdate(timestamp: Date): string {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  }
}
