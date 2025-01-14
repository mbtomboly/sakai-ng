import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { DonutComponent } from './components/donut/donut.component';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Egreso, Tarjeta } from '../../models/models';
import { FirestoreService } from '../../services/firestore.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MilesPipe } from '../../pipes/miles.pipe';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget,
         DonutComponent, DatePickerModule, FormsModule, DatePipe, ProgressSpinnerModule, MilesPipe, ChartModule,
        TableModule, Select
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <!-- <span class="block text-muted-color font-medium mb-4">Revenue</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div> -->
                        <p-datepicker view="month" dateFormat="mm/yy" [readonlyInput]="true"
                        [showIcon]="true" [showButtonBar]="true" [(ngModel)]="date" (onSelect)="loadEgresos()"></p-datepicker>
                        <div class="text-surface-900 dark:text-surface-0 pl-2 pt-2 font-medium text-xl">{{ date | date:'MMMM':'es'}}</div>
                    </div>
                </div>

            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                @if (loading) {
                    <div>
                      <p-progress-spinner class="" ariaLabel="loading" [style]="{ width: '60px', height: '60px' }" />
                    </div>
                } @else {
                    <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total Gastos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Gs. {{ total | miles }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                }
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
            @if (loading) {
                    <div>
                      <p-progress-spinner class="" ariaLabel="loading" [style]="{ width: '60px', height: '60px' }" />
                    </div>
                } @else {
                <div class="flex justify-between mb-4">
                    <div>
                        <!-- <span class="block text-muted-color font-medium mb-4">Tarjetas</span> -->
                        <p-select [options]="tarjetas" [(ngModel)]="selectedTarjeta" [showClear]="true"
                         optionLabel="nombre" placeholder="Tarjetas" class="w-full" (onChange)="tarjetaSelected($event)" />
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Gs. {{ tarjeta | miles }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-credit-card text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                }
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
            @if (loading) {
                    <div>
                      <p-progress-spinner class="" ariaLabel="loading" [style]="{ width: '60px', height: '60px' }" />
                    </div>
                } @else {
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Contado</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Gs. {{ contado | miles }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-money-bill text-purple-500 !text-xl"></i>
                    </div>
                </div>
                }
            </div>
        </div>
            <div class="col-span-12 xl:col-span-6">

            <div class="card !mb-8">
            @if (loading) {
                    <div>
                      <p-progress-spinner class="" ariaLabel="loading" [style]="{ width: '60px', height: '60px' }" />
                    </div>
                } @else {
                    <div class="font-semibold text-xl mb-4">Gastos {{ date | date:'MMMM':'es'}}</div>
                    <p-table [value]="filteredEgresos" [paginator]="true" [rows]="5" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th >Nombre</th>
                                <th >Categoria</th>
                                <th >Monto</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-egreso>
                            <tr>
                                <td style="width: 35%; min-width: 7rem;">{{ egreso.nombre }}</td>
                                <td style="width: 35%; min-width: 7rem;">{{ egreso.categoria }}</td>
                                <td style="width: 35%; min-width: 8rem;">{{ egreso.monto | miles }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                }

            </div>

            </div>
            <div class="col-span-12 xl:col-span-6">
                <div class="card !mb-8">
                    @if (loading) {
                        <div>
                          <p-progress-spinner class="" ariaLabel="loading" [style]="{ width: '60px', height: '60px' }" />
                        </div>
                    } @else {
                        <div class="font-semibold text-xl mb-4">Categorias</div>
                        <p-chart type="doughnut" [data]="pieData" [options]="pieOptions" class="h-80"></p-chart>
                    }
                </div>

                <!-- <app-revenue-stream-widget /> -->
                <!-- <app-notifications-widget /> -->
            </div>
        </div>
    `
})
export class Dashboard {

    date = new Date;
    loading = true;
    egresos: Egreso[] = [];
    filteredEgresos: Egreso[] = [];
    total = 0;
    tarjeta = 0;
    contado = 0;

    tarjetas: Tarjeta[] = [];
    selectedTarjeta: any;

    pieData: any;
    pieOptions: any;

    constructor(private fireService: FirestoreService) {
        this.loadEgresos();
        this.getTarjetas();
        // this.initCharts();
    }

    tarjetaSelected(event: any) {
        console.log(event.value);
        if (event.value === null) {
            this.filteredEgresos = this.egresos;
            this.reset();
        } else {
            this.filteredEgresos = this.egresos.filter((it: any) =>
                it.tarjeta === event.value.nombre || it.tarjeta === event.value.ID);
            this.recal();
        }
    }

    reset() {
        this.total = 0;
        this.contado = 0;
        this.tarjeta = 0;
        this.filteredEgresos.forEach(element => {
            this.total += element.monto;
            element.contado ? this.contado += element.monto : this.tarjeta += element.monto;
        });
        this.initCharts();
    }

    recal() {
        this.tarjeta = 0;
        this.filteredEgresos.forEach((element) => {
            this.tarjeta += element.monto;
        });
        this.initCharts();
    }

    getTarjetas() {
        this.fireService.getDocs('tarjetas').then((data) => {
            this.tarjetas = data;
        }).catch((er) => {
            console.log(er);
        });
    }

    loadEgresos() {
        this.total = 0;
        this.tarjeta = 0;
        this.contado = 0;
        this.loading = true;
        let firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
        let lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
        this.fireService.getBetweenDates('egresos', firstDay, lastDay).then((data) => {
            data.forEach((element: {
                contado: any;
                monto: number; fecha: any;
            }) => {
                this.total += element.monto;
                element.contado ? this.contado += element.monto : this.tarjeta += element.monto;
                element.fecha = new Date(element.fecha.seconds * 1000);
            });
            this.egresos = data;
            this.filteredEgresos = data;
            console.log(data);
            this.loading = false;
            this.initCharts();
        }).catch((er) => {
            console.log(er);
            this.loading = false;
        });
    }

    initCharts() {

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        let result: any = [];
        this.filteredEgresos.reduce(function(res: any, value: any) {
          if (!res[value.categoria]) {
            res[value.categoria] = { categoria: value.categoria, monto: 0 };
            result.push(res[value.categoria])
          }
          res[value.categoria].monto += value.monto;
          return res;
        }, {});

        console.log(result);

        let colors = ['--p-indigo-', '--p-purple-', '--p-teal-', '--p-orange-', '--p-cyan-', '--p-gray-',
            '--p-sky-', '--p-amber-', '--p-fuchsia-', '--p-violet-', '--p-rose-', '--p-slate-'
            , '--p-zinc-', '--p-stone-', '--p-blue-', '--p-lime-', '--p-emerald-'
        ];

        this.pieData = {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }
            ]
        };

        result.forEach((element: { categoria: any; monto: any; }) => {
            this.pieData.labels.push(element.categoria);
            this.pieData.datasets[0].data.push(element.monto);
            let i = Math.floor(Math.random() * colors.length)
            this.pieData.datasets[0].backgroundColor.push(documentStyle.getPropertyValue(colors[i] + '500'));
            this.pieData.datasets[0].hoverBackgroundColor.push(documentStyle.getPropertyValue(colors[i] + '400'));
            colors.splice(i, 1);
        });

        // this.pieData = {
        //     labels: ['A', 'B', 'C'],
        //     datasets: [
        //         {
        //             data: [540, 325, 702],
        //             backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
        //             hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
        //         }
        //     ]
        // };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

}
