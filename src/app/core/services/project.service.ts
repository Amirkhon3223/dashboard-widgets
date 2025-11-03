import { Injectable, signal, computed } from '@angular/core';
import { Observable, delay, of, interval } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Project, ProjectStatus, ProjectStats } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSignal = signal<Project[]>([]);

  public readonly stats = computed<ProjectStats>(() => {
    const projects = this.projectsSignal();
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
    const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
    const averageProgress = totalProjects > 0
      ? projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects
      : 0;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      averageProgress: Math.round(averageProgress)
    };
  });

  public readonly projects = this.projectsSignal.asReadonly();

  constructor() {
    this.loadProjects();
  }

  /**
   * Загружает проекты асинхронно с имитацией задержки сети
   */
  public loadProjects(): void {
    this.getProjects().subscribe(projects => {
      this.projectsSignal.set(projects);
    });
  }

  /**
   * Возвращает Observable с проектами (эмуляция HTTP запроса)
   */
  private getProjects(): Observable<Project[]> {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'E-commerce Platform',
        status: ProjectStatus.ACTIVE,
        progress: 75,
        tasksCompleted: 45,
        tasksTotal: 60,
        startDate: '2024-01-15',
        endDate: '2025-03-30',
        description: 'Modern e-commerce platform with microservices architecture',
        team: ['Alice', 'Bob', 'Charlie']
      },
      {
        id: '2',
        name: 'Mobile Banking App',
        status: ProjectStatus.ACTIVE,
        progress: 60,
        tasksCompleted: 80,
        tasksTotal: 85,
        startDate: '2024-06-01',
        endDate: '2025-09-30',
        description: 'Secure mobile banking application with biometric authentication',
        team: ['David', 'Eve', 'Frank']
      },
      {
        id: '3',
        name: 'AI Analytics Dashboard',
        status: ProjectStatus.PENDING,
        progress: 30,
        tasksCompleted: 15,
        tasksTotal: 50,
        startDate: '2024-08-01',
        endDate: '2025-12-31',
        description: 'AI-powered analytics dashboard for business intelligence',
        team: ['Grace', 'Henry']
      },
      {
        id: '4',
        name: 'CRM System',
        status: ProjectStatus.COMPLETED,
        progress: 100,
        tasksCompleted: 120,
        tasksTotal: 120,
        startDate: '2023-03-01',
        endDate: '2024-10-15',
        description: 'Customer relationship management system',
        team: ['Ivan', 'Julia', 'Kevin', 'Laura']
      },
      {
        id: '5',
        name: 'IoT Smart Home',
        status: ProjectStatus.ACTIVE,
        progress: 85,
        tasksCompleted: 34,
        tasksTotal: 40,
        startDate: '2024-04-10',
        endDate: '2025-06-20',
        description: 'IoT platform for smart home automation',
        team: ['Mike', 'Nancy']
      },
      {
        id: '6',
        name: 'Blockchain Wallet',
        status: ProjectStatus.ON_HOLD,
        progress: 45,
        tasksCompleted: 22,
        tasksTotal: 48,
        startDate: '2024-07-01',
        endDate: '2025-11-30',
        description: 'Secure cryptocurrency wallet with multi-chain support',
        team: ['Oliver', 'Penny', 'Quinn']
      }
    ];

    return of(mockProjects).pipe(
      delay(Math.random() * 1000 + 500),
      shareReplay(1)
    );
  }

  /**
   * Возвращает Observable для real-time обновлений
   * Эмулирует изменение прогресса проектов каждые 5 секунд
   */
  public getRealTimeUpdates(): Observable<Project[]> {
    return interval(5000).pipe(
      map(() => {
        const currentProjects = this.projectsSignal();
        return currentProjects.map(project => {
          if (project.status === ProjectStatus.ACTIVE && project.progress < 100) {
            const newProgress = Math.min(100, project.progress + Math.floor(Math.random() * 3));
            const progressDiff = newProgress - project.progress;
            const newTasksCompleted = Math.min(
              project.tasksTotal,
              project.tasksCompleted + Math.floor((progressDiff / 100) * project.tasksTotal)
            );

            return {
              ...project,
              progress: newProgress,
              tasksCompleted: newTasksCompleted
            };
          }
          return project;
        });
      }),
      shareReplay(1)
    );
  }

  /**
   * Обновляет projects signal с новыми данными
   */
  public updateProjects(projects: Project[]): void {
    this.projectsSignal.set(projects);
  }
}
