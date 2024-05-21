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
    name: string;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
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
  selectedCountry: 'usa' | 'ca' = 'usa';
  private chartInstance!: Chart;
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
    this.createMap(this.selectedCountry);
  }

  selectCountry(country: 'usa' | 'ca') {
    this.selectedCountry = country;
    this.fetchGraphDetails(this.selectedCountry, '');
    this.createMap(country);
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

  ngOnDestroy() {
    this.chartInstance.destroy();
  }

  createMap(country: 'ca' | 'usa') {
    let url: string = '';
    let projectionName: string = '';
    let label: string = '';

    if (country === 'ca') {
      url = 'assets/canadageo.json';
      projectionName = 'equirectangular';
      label = 'Canada Provinces';
    } else if (country === 'usa') {
      url = 'https://unpkg.com/us-atlas/states-10m.json';
      projectionName = 'albersUsa';
      label = 'USA States';
    }

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        let features: any;
        let outline;

        if (country === 'ca') {
          features = data.features;
          outline = data;
        } else if (country === 'usa') {
          outline = (
            ChartGeo.topojson.feature(data, data.objects.nation) as any
          ).features[0];
          features = (
            ChartGeo.topojson.feature(data, data.objects.states) as any
          ).features;
        }
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }
        this.chartInstance = new Chart(this.context, {
          type: 'choropleth',
          data: {
            labels: features.map((d: any) => d.properties.name),
            datasets: [
              {
                label: label,
                outline: outline,
                data: features.map((d: any) => ({
                  feature: d,
                  value: Math.random() * 100,
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
                const stateName = features[elements[0].index].properties.name;
                console.log('Clicked State:', stateName);
                this.fetchGraphDetails(country, stateName);
              }
            },
            scales: {
              projection: {
                axis: 'x',
                projection: projectionName as any,
              },
              color: {
                axis: 'x',
                quantize: 5,
                display: false,
              },
            },
            responsive: true,
          },
        });
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
  //               projection: 'equirectangular',
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

  // createMap() {
  //   fetch('https://unpkg.com/us-atlas/states-10m.json')
  //     .then((r) => r.json())
  //     .then((us) => {
  //       const nation = (ChartGeo.topojson.feature(us, us.objects.nation) as any)
  //         .features[0];
  //       const states = (ChartGeo.topojson.feature(us, us.objects.states) as any)
  //         .features;

  //       const chart = new Chart(this.context, {
  //         type: 'choropleth',
  //         data: {
  //           labels: states.map((d: any) => d.properties.name),
  //           datasets: [
  //             {
  //               label: 'States',
  //               outline: nation,
  //               data: states.map((d: any) => ({
  //                 feature: d,
  //                 value: 0,
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
  //           interaction: {
  //             mode: 'nearest',
  //             intersect: false,
  //           },

  //           onClick: (event, elements) => {
  //             if (elements && elements.length > 0) {
  //               const stateName = states[elements[0].index].properties.name;
  //               console.log('Clicked State:', stateName);
  //               this.fetchGraphDetails('usa', stateName);
  //             }
  //           },
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
  //         },
  //       });
  //     });
  // }
}
