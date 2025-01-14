import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FirestoreService } from '../../../../services/firestore.service';

@Component({
  selector: 'app-donut',
  imports: [ChartModule],
  templateUrl: './donut.component.html',
  styleUrl: './donut.component.scss'
})
export class DonutComponent implements OnInit {

    pieData: any;
    pieOptions: any;

    constructor(private fireService: FirestoreService) {

    }

    ngOnInit() {
        this.initCharts();
    }

    initCharts() {

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
                }
            ]
        };

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
