export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  order: number;
  visible: boolean;
  config?: WidgetConfig;
}

export enum WidgetType {
  PROJECT_LIST = 'project-list',
  PROJECT_STATS = 'project-stats',
  PROGRESS_CHART = 'progress-chart',
  TIMELINE = 'timeline',
  REAL_TIME_UPDATES = 'real-time-updates'
}

export interface WidgetConfig {
  refreshInterval?: number;
  filters?: WidgetFilters;
  chartType?: 'bar' | 'line' | 'doughnut' | 'pie';
  showLegend?: boolean;
}

export interface WidgetFilters {
  status?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface DashboardState {
  widgets: Widget[];
  lastUpdated: string;
}
