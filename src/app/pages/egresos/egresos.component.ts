import { ChangeDetectorRef, Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '../service/product.service';
import { Egreso } from '../../models/models';
import { FirestoreService } from '../../services/firestore.service';
import { MilesPipe } from '../../pipes/miles.pipe';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastService } from '../../services/toast.service';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { IngresosComponent } from '../ingresos/ingresos.component';
import { ProgressBar } from 'primeng/progressbar';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-egresos',
    templateUrl: './egresos.component.html',
    styleUrl: './egresos.component.scss',
    standalone: true,
  imports: [
    Toast,
    ProgressBar,
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    MilesPipe,
    DatePickerModule,
    ToggleButtonModule,
    ProgressSpinnerModule
],
  providers: [MessageService, ProductService, ConfirmationService, IngresosComponent]
})
export class EgresosComponent {

    productDialog: boolean = false;

    products = signal<Product[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    egresos = signal<Egreso[]>([]);
    egreso!: Egreso;
    selectedEgreso!: Egreso[] | null;
    date = new Date;
    calendarValue: any = null;
    categorias: any = [];
    tarjetas: any = [];
    loading = true;
    displayConfirmation: boolean = false;

    isEdit = false;


    constructor(
        private service: MessageService,
        private fireService: FirestoreService,
        private toasty: ToastService,
        private cdr: ChangeDetectorRef
    ) {}

    showLoader(message: string) {
            this.service.add({
                key: 'confirm',
                sticky: true,
                severity: 'custom',
                summary: message,
                styleClass: 'backdrop-blur-lg rounded-2xl',
            });
    }


    showInfoViaToast(titulo: string, message: string) {
        this.service.add({ severity: 'info', summary: titulo, detail: message });
    }

    showWarnViaToast(titulo: string, message: string) {
        this.service.add({ severity: 'warn', summary: titulo, detail: message });
    }

    showErrorViaToast(titulo: string, message: string) {
        this.service.add({ severity: 'error', summary: titulo, detail: message });
    }

    showSuccessViaToast(titulo: string, message: string) {
        this.service.add({ severity: 'success', summary: titulo, detail: message });
    }

    clear() {
        this.service.clear();
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    testMessage() {
        this.toasty.showInfo('some', 'test');
    }


    ngOnInit() {
        // this.loadDemoData();
        this.loadEgresos();
        this.loadCategoriasTarjetas();
    }

    registrarEgreso() {
        this.submitted = true;
        if (!this.egreso.nombre || !this.egreso.monto || !this.egreso.categoria) {
            this.showWarnViaToast('Atencion', 'Complete los campos obligatorios');
        } else {
            this.showLoader('Registrando egreso');
        let _egresos = this.egresos();
        if (this.egreso.contado) {
            delete this.egreso.tarjeta;
        }
        this.fireService.createDoc('egresos', this.egreso).then((data) => {
            this.egreso.ID = data.id;
            this.egresos.set([..._egresos, this.egreso]);
            this.clear();
            this.showSuccessViaToast('Egreso registrado', 'Egreso registrado correctamente');
            this.hideDialog();
            this.egreso = {} as Egreso;
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al registrar el egreso');
            this.hideDialog();
            this.egreso = {} as Egreso;
        });
    }
    }

    loadCategoriasTarjetas() {
        this.fireService.getDocs('categorias').then((data) => {
            this.categorias = data;
            // data.forEach((element: { nombre: any; }) => {
            //     let categ: any = {};
            //     categ.label = element.nombre;
            //     categ.value = element.nombre;
            //     this.categorias.push(categ);
            // });
        });
        this.fireService.getDocs('tarjetas').then((data) => {
            this.tarjetas = data;
            // data.forEach((element: { nombre: any; }) => {
            //     let tarj: any = {};
            //     tarj.label = element.nombre;
            //     tarj.value = element.nombre;
            //     this.tarjetas.push(tarj);
            // });
        });
    }

    loadEgresos() {
        this.loading = true;
        let firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
        let lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
        this.fireService.getBetweenDates('egresos', firstDay, lastDay).then((data) => {
            data.forEach((element: { fecha: any; }) => {
                element.fecha = new Date(element.fecha.seconds * 1000);
            });
            this.egresos.set(data);
            console.log(data);
            this.loading = false;
        }).catch((er) => {
            console.log(er);
            this.loading = false;
        });

        this.cols = [
            { field: 'ID', header: 'ID', customExportHeader: 'ID Egreso' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'categoria', header: 'Categoria' },
            { field: 'monto', header: 'Monto' },
            { field: 'fecha', header: 'Fecha' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.egreso = {} as Egreso;
        this.egreso.contado = true;
        this.egreso.fecha = this.date;
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    openEdit(egreso: Egreso) {
        this.isEdit = true;
        this.egreso = { ...egreso };
        this.productDialog = true;
        this.submitted = false;
    }

    editEgreso() {
        this.showLoader('Actualizando egreso');
        this.fireService.updateDoc('egresos', this.egreso.ID!, this.egreso).then(() => {
            let _egresos = this.egresos();
            let index = this.findIndexById(this.egreso.ID!);
            _egresos[index] = this.egreso;
            this.egresos.set(_egresos);
            this.clear();
            this.showSuccessViaToast('Egreso actualizado', 'Egreso actualizado correctamente');
            this.hideDialog();
            this.egreso = {} as Egreso;
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al actualizar el egreso');
            this.hideDialog();
            this.egreso = {} as Egreso;
        });
    }


    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
        this.isEdit = false;
    }

    deleteProduct() {
        this.showLoader('Eliminando egreso');
        this.fireService.deleteDoc('egresos', this.egreso.ID!).then(() => {
            let _egresos = this.egresos();
            let index = this.findIndexById(this.egreso.ID!);
            _egresos.splice(index, 1);
            this.egresos.set(_egresos);
            this.clear();
            this.showSuccessViaToast('Egreso eliminado', 'Egreso eliminado correctamente');
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al eliminar el egreso');
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.egresos().length; i++) {
            if (this.egresos()[i].ID === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    openConfirmation(egreso: Egreso) {
        this.egreso = egreso;
        this.displayConfirmation = true;
    }

    closeConfirmation() {
        this.displayConfirmation = false;
    }

}
