import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';

import { Chart, CategoryScale, registerables } from 'chart.js';
import * as ChartGeo from 'chartjs-chart-geo';
import {
  ChoroplethController,
  ProjectionScale,
  ColorScale,
  GeoFeature,
} from 'chartjs-chart-geo';
import { AnalyticsService } from '../../../core/services/dashboard/analytics.service';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-location-graph',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './location-graph.component.html',
  styleUrl: './location-graph.component.css',
})
export class LocationGraphComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: any;
  graphData: any;
  chart!: Chart;
  constructor(
    private analyticsService: AnalyticsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchGraphDetails('usa', '');
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
    // this.createChoroplethMap();
  }

  async createChoroplethMap() {
    // Fetch GeoJSON data for Canada
    const response = await fetch(
      'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson'
    );
    const canadaGeoJSON = await response.json();

    // Prepare the data
    const data = {
      labels: canadaGeoJSON.features.map((d: any) => d.properties.name),
      datasets: [
        {
          label: 'Canada Choropleth',
          data: canadaGeoJSON.features.map((d: any) => ({
            feature: d,
            value: Math.random() * 100,
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          outline: canadaGeoJSON,
        },
      ],
    };

    this.chart = new Chart(this.context, {
      type: 'choropleth',
      data: data,
      options: {
        showOutline: true,
        showGraticule: false,
        scales: {
          xy: {
            projection: 'equalEarth',
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context: any) =>
                `${
                  context.feature.properties.name
                }: ${context.raw.value.toFixed(2)}`,
            },
          },
        },
      },
    });
  }

  fetchGraphDetails(country: string, state: string) {
    let paylod = {
      country: country,
      state: state,
    };
    this.analyticsService.getLocationGraph(paylod).subscribe({
      next: (data: any) => {
        console.log('location', data);
        this.graphData = data?.data;
        const allUsers = this.graphData.allUsers;

        this.graphData.activeBuyersPercent =
          allUsers !== 0
            ? ((this.graphData.activeBuyers / allUsers) * 100).toFixed(1)
            : 0;
        this.graphData.activeSellersPercent =
          allUsers !== 0
            ? ((this.graphData.activeSellers / allUsers) * 100).toFixed(1)
            : 0;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // createMap() {
  //   fetch('assets/canadageo.json')
  //     .then((r) => r.json())
  //     .then((world) => {
  //       const canadaGeoJSON = world;

  //       const chart = new Chart(this.context, {
  //         type: 'choropleth',
  //         data: {
  //           labels: canadaGeoJSON.features.map((d: any) => d.properties.name),
  //           datasets: [
  //             {
  //               label: 'States',
  //               outline: canadaGeoJSON,
  //               data: canadaGeoJSON.features.map((d: any) => ({
  //                 feature: d,
  //                 value: Math.random() * 100,
  //               })),
  //               backgroundColor: '#377E7F',
  //               borderColor: '#ffffff',
  //               hoverBackgroundColor: '#0B5455',
  //               clickBackgroundColor: '#0B5455',
  //             },
  //           ],
  //         },
  //         options: {
  //           plugins: {
  //             legend: {
  //               display: false,
  //             },
  //             tooltip: {
  //               callbacks: {
  //                 label: (tooltipItem: any) => {
  //                   const stateName = tooltipItem.raw.feature.properties.name;
  //                   return stateName;
  //                 },
  //               },
  //             },
  //           },
  //           // interaction: {
  //           //   mode: 'nearest',
  //           //   intersect: false,
  //           // },

  //           // onClick: (event, elements) => {
  //           //   if (elements && elements.length > 0) {
  //           //     const stateName = states[elements[0].index].properties.name;
  //           //     console.log('Clicked State:', stateName);
  //           //   }
  //           // },
  //           scales: {
  //             projection: {
  //               axis: 'x',
  //               projection: 'albersUsa',
  //             },
  //             color: {
  //               axis: 'x',
  //               quantize: 5,
  //               display: false,
  //             },
  //           },
  //           responsive: true,
  //         },
  //       });
  //     });
  // }

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
                  value: 0,
                })),
                backgroundColor: '#377E7F',
                borderColor: '#ffffff',
                hoverBackgroundColor: '#0B5455',
                clickBackgroundColor: '#0B5455',
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem: any) => {
                    const stateName = tooltipItem.raw.feature.properties.name;
                    return stateName;
                  },
                },
              },
            },
            interaction: {
              mode: 'nearest',
              intersect: false,
            },

            onClick: (event, elements) => {
              if (elements && elements.length > 0) {
                const stateName = states[elements[0].index].properties.name;
                console.log('Clicked State:', stateName);
                this.fetchGraphDetails('usa', stateName);
              }
            },
            scales: {
              projection: {
                axis: 'x',
                projection: 'albersUsa',
              },
              color: {
                axis: 'x',
                quantize: 5,
                display: false,
              },
            },
          },
        });
      });
  }
}
