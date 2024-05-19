import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Chart } from 'chart.js';
import { AnalyticsService } from '../../../core/services/dashboard/analytics.service';
import { EquipmentCategory } from '../../../core/models/equipmentCategories';
import { TimePeriods } from '../../../core/models/periods';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.css',
})
export class SalesReportComponent {
  @ViewChild('barChartCanvas') private barChartCanvas!: ElementRef;
  equipmentCategories!: string[];
  timePeriods!: string[];
  selectedCategory: string = 'Tractors';
  selectedPeriod: string = 'MONTH';
  graphData: any[] = [];
  private chart!: Chart;
  isLoading = true;
  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchGraphDetails();
    this.equipmentCategories = Object.values(EquipmentCategory);
    this.timePeriods = Object.values(TimePeriods);
  }

  // ngAfterViewInit() {
  //   this.fetchGraphDetails();
  // }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  fetchGraphDetails() {
    let payload = {
      category: this.selectedCategory,
      duration: this.selectedPeriod,
    };
    this.analyticsService.getSalesGraph(payload).subscribe({
      next: (data: any) => {
        console.log('sales', data);
        this.graphData = data?.data;
        this.isLoading = false;
        this.cdr.detectChanges();
        const amounts = data?.data.map((item: any) => item.amount || 0);
        const labels = this.getLabelsForPeriod(this.selectedPeriod);
        this.createBarChart(amounts, labels);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.fetchGraphDetails();
  }

  onTimePeriodSelect(period: string): void {
    this.selectedPeriod = period;
    this.fetchGraphDetails();
  }

  getLabelsForPeriod(period: string): string[] {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonthIndex = new Date().getMonth();
    switch (period) {
      case 'MONTH':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case 'THREE_MONTHS':
        return monthNames.slice(currentMonthIndex - 2, currentMonthIndex + 1);
      case 'YEAR':
        return monthNames
          .slice(currentMonthIndex + 1)
          .concat(monthNames.slice(0, currentMonthIndex + 1));
      default:
        return [];
    }
  }

  createBarChart(data: number[], labels: string[]): void {
    const barChartCtx = this.barChartCanvas.nativeElement.getContext('2d');

    const maxDataValue = Math.max(...data);
    const stepSize = Math.ceil(maxDataValue / 5);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(barChartCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sales',
            data: data,
            backgroundColor: '#377E7F',
            borderColor: '#377E7F',
            borderWidth: 1,
            barPercentage: 0.3,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Tractor Price',
            },
            ticks: {
              stepSize: stepSize,
            },
            max: stepSize * 5,
          },
        },
        plugins: {
          tooltip: {
            enabled: false, // Disable tooltip
          },
          legend: {
            display: false, // Hide legend
          },
        },
        layout: {
          padding: {
            top: 20,
            bottom: 20,
          },
        },
      },
    });
  }
}
