import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, CategoryScale, registerables } from 'chart.js';
import * as ChartGeo from 'chartjs-chart-geo';
import {
  ChoroplethController,
  ProjectionScale,
  ColorScale,
  GeoFeature,
} from 'chartjs-chart-geo';
interface GeoJSONFeature {
  type: string;
  properties: {
    name: string; // Or whatever properties your GeoJSON features have
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][]; // Adjust this based on your GeoJSON format
  };
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: any;

  constructor() {}

  ngOnInit(): void {
    Chart.register(
      CategoryScale,
      ChoroplethController,
      ProjectionScale,
      ColorScale,
      GeoFeature
    );
    this.context = this.canvas.nativeElement.getContext('2d');
    Chart.register(...registerables);
    this.createMap();
  }

  createMap() {
    fetch('https://unpkg.com/us-atlas/states-10m.json')
      .then((r) => r.json())
      .then((us) => {
        const nation = (ChartGeo.topojson.feature(us, us.objects.nation) as any)
          .features[0];
        const states = (ChartGeo.topojson.feature(us, us.objects.states) as any)
          .features;

        const chart = new Chart(this.context, {
          type: 'choropleth',
          data: {
            labels: states.map((d: any) => d.properties.name),
            datasets: [
              {
                label: 'States',
                outline: nation,
                data: states.map((d: any) => ({
                  feature: d,
                  value: Math.random() * 10,
                })),
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              projection: {
                axis: 'x',
                projection: 'albersUsa',
              },
              color: {
                axis: 'x',
                quantize: 5,
                legend: {
                  position: 'bottom-right',
                  align: 'bottom',
                },
              },
            },
          },
        });
      });
  }
}
