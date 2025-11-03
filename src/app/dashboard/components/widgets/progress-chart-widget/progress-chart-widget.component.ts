import {
  Component,
  inject,
  input,
  computed,
  effect,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ProjectService } from '../../../../core/services/project.service';
import { WidgetConfig } from '../../../../core/models/widget.model';

Chart.register(...registerables);

@Component({
  selector: 'app-progress-chart-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-chart-widget.component.html',
  styleUrl: './progress-chart-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressChartWidgetComponent  implements OnDestroy{
  private readonly projectService = inject(ProjectService);
  private chart: Chart | null = null;

  public readonly config = input<WidgetConfig>();
  protected readonly chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');

  protected readonly projects = this.projectService.projects;

  private readonly chartData = computed(() => {
    const projects = this.projects();
    return {
      labels: projects.map(p => p.name),
      datasets: [
        {
          label: 'Progress (%)',
          data: projects.map(p => p.progress),
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(72, 187, 120, 0.8)',
            'rgba(66, 153, 225, 0.8)',
            'rgba(237, 137, 54, 0.8)',
            'rgba(245, 101, 101, 0.8)'
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)',
            'rgba(72, 187, 120, 1)',
            'rgba(66, 153, 225, 1)',
            'rgba(237, 137, 54, 1)',
            'rgba(245, 101, 101, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    };
  });

  constructor() {
    effect(() => {
      const canvas = this.chartCanvas()?.nativeElement;
      if (!canvas) return;

      const data = this.chartData();
      const chartType = this.config()?.chartType || 'bar';

      if (this.chart) {
        this.chart.data = data;
        this.chart.options.plugins!.title!.text = `Project Progress Overview (${chartType.toUpperCase()})`;
        this.chart.update();
      } else {
        this.createChart(canvas, data, chartType);
      }
    });
  }

  private createChart(
    canvas: HTMLCanvasElement,
    data: ChartConfiguration['data'],
    type: 'bar' | 'line' | 'doughnut' | 'pie' = 'bar'
  ): void {
    const config: ChartConfiguration = {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.config()?.showLegend !== false,
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12,
                weight: 500
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          title: {
            display: true,
            text: `Project Progress Overview (${type.toUpperCase()})`,
            font: {
              size: 16,
              weight: 'bold' as const
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: (context) => {
                const value = context.parsed.y || context.parsed;
                return `Progress: ${value}%`;
              }
            }
          }
        },
        scales:
          type === 'bar' || type === 'line'
            ? {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: (value) => `${value}%`,
                    font: {
                      size: 11
                    }
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  ticks: {
                    font: {
                      size: 11
                    },
                    maxRotation: 45,
                    minRotation: 0
                  },
                  grid: {
                    display: false
                  }
                }
              }
            : undefined
      }
    };

    this.chart = new Chart(canvas, config);
  }

  public ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
