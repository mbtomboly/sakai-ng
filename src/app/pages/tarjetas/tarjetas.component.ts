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
import { Categoria, Egreso, Tarjeta } from '../../models/models';
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
  selector: 'app-tarjetas',
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
  templateUrl: './tarjetas.component.html',
  styleUrl: './tarjetas.component.scss',
  providers: [MessageService, ProductService, ConfirmationService]
})
export class TarjetasComponent {

    productDialog: boolean = false;

    products = signal<Product[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    tarjetas = signal<Tarjeta[]>([]);
    tarjeta!: Tarjeta;
    selectedTarjeta!: Tarjeta[] | null;
    displayConfirmation: boolean = false;

    date = new Date;
    calendarValue: any = null;
    loading = true;

    isEdit = false;

    titulares = [{label: 'Mariano'},
                 {label: 'Melany'}];

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
        // this.loadEgresos();
        this.loadtarjetas();
    }

    registrarEgreso() {
        this.submitted = true;
        if (!this.tarjeta.nombre || !this.tarjeta.titular || !this.tarjeta.limite) {
            this.showWarnViaToast('Atencion', 'Complete los campos obligatorios');

        } else {
        this.showLoader('Creando Tarjeta');
        let _tarjetas = this.tarjetas();

        this.fireService.createDoc('tarjetas', this.tarjeta).then((data) => {
            this.tarjeta.ID = data.id;
            this.tarjetas.set([..._tarjetas, this.tarjeta]);
            this.clear();
            this.showSuccessViaToast('Tarjeta creada', 'Tarjeta creada correctamente');
            this.hideDialog();
            this.tarjeta = {} as Tarjeta;
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al crear la tarjeta');
            this.hideDialog();
            this.tarjeta = {} as Tarjeta;
        });
        }
    }

    loadtarjetas() {
        this.loading = true;
        this.fireService.getDocs('tarjetas').then((data) => {
            this.tarjetas.set(data);
            this.loading = false;
        }).catch((er) => {
            console.log(er);
            this.loading = false;
            this.showErrorViaToast('Error', 'Error al cargar las tarjetas');
        });

        this.cols = [
            { field: 'ID', header: 'ID', customExportHeader: 'ID Tarjeta' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'titular', header: 'Titular' },
            { field: 'limite', header: 'Limite' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.tarjeta = {} as Tarjeta;
        this.submitted = false;
        this.productDialog = true;
    }

    openEdit(tarjeta: Tarjeta) {
        this.isEdit = true;
        this.tarjeta = { ...tarjeta };
        this.productDialog = true;
        this.submitted = false;
    }

    edittarjeta() {
        this.showLoader('Actualizando tarjeta');
        this.fireService.updateDoc('tarjetas', this.tarjeta.ID!, this.tarjeta).then(() => {
            let _tarjetas = this.tarjetas();
            let index = this.findIndexById(this.tarjeta.ID!);
            _tarjetas[index] = this.tarjeta;
            this.tarjetas.set(_tarjetas);
            this.clear();
            this.showSuccessViaToast('Tarjeta actualizado', 'Tarjeta actualizada correctamente');
            this.hideDialog();
            this.tarjeta = {} as Tarjeta;
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al actualizar la tarjeta');
            this.hideDialog();
            this.tarjeta = {} as Tarjeta;
        });
    }


    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
        this.isEdit = false;
    }

    deleteProduct() {
        this.showLoader('Eliminando tarjeta');
        this.fireService.deleteDoc('tarjetas', this.tarjeta.ID!).then(() => {
            let _tarjetas = this.tarjetas();
            let index = this.findIndexById(this.tarjeta.ID!);
            _tarjetas.splice(index, 1);
            this.tarjetas.set(_tarjetas);
            this.clear();
            this.showSuccessViaToast('Tarjeta eliminada', 'Tarjeta eliminada correctamente');
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al eliminar la tarjeta');
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.tarjetas().length; i++) {
            if (this.tarjetas()[i].ID === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    openConfirmation(tarjeta: Tarjeta) {
        this.tarjeta = tarjeta;
        this.displayConfirmation = true;
    }

    closeConfirmation() {
        this.displayConfirmation = false;
    }

}
