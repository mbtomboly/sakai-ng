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
import { Categoria, Egreso } from '../../models/models';
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
  selector: 'app-categorias',
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
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
  providers: [MessageService, ProductService, ConfirmationService]
})
export class CategoriasComponent {

    productDialog: boolean = false;

    products = signal<Product[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    categorias = signal<Categoria[]>([]);
    categoria!: Categoria;
    selectedCategoria!: Categoria[] | null;
    displayConfirmation: boolean = false;
    egresos = signal<Egreso[]>([]);
    egreso!: Egreso;
    selectedEgreso!: Egreso[] | null;
    date = new Date;
    calendarValue: any = null;
    // categorias: any = [];
    // tarjetas: any = [];
    loading = true;

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
        // this.loadEgresos();
        this.loadCategorias();
    }

    registrarEgreso() {
        this.submitted = true;
        if (!this.categoria.nombre) {
            this.showWarnViaToast('Atencion', 'Complete los campos obligatorios');
        } else {
            this.showLoader('Creando Categoria');

        let _categorias = this.categorias();

        this.fireService.createDoc('categorias', this.categoria).then((data) => {
            this.categoria.ID = data.id;
            this.categorias.set([..._categorias, this.categoria]);
            this.clear();
            this.showSuccessViaToast('Categoria creada', 'Categoria creada correctamente');
            this.hideDialog();
            this.categoria = {} as Categoria;
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al crear la categoria');
            this.hideDialog();
            this.categoria = {} as Categoria;
        });
    }
    }

    loadCategorias() {
        this.loading = true;
        this.fireService.getDocs('categorias').then((data) => {
            this.categorias.set(data);
            this.loading = false;
        }).catch((er) => {
            console.log(er);
            this.loading = false;
            this.showErrorViaToast('Error', 'Error al cargar las categorias');
        });

        this.cols = [
            { field: 'ID', header: 'ID', customExportHeader: 'ID Categoria' },
            { field: 'nombre', header: 'Nombre' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.categoria = {} as Categoria;
        this.submitted = false;
        this.productDialog = true;
    }

    openEdit(categoria: Categoria) {
        this.isEdit = true;
        this.categoria = { ...categoria };
        this.productDialog = true;
        this.submitted = false;
    }

    editCategoria() {
        this.showLoader('Actualizando categoria');
        this.fireService.updateDoc('categorias', this.categoria.ID!, this.categoria).then(() => {
            let _categorias = this.categorias();
            let index = this.findIndexById(this.categoria.ID!);
            _categorias[index] = this.categoria;
            this.categorias.set(_categorias);
            this.clear();
            this.showSuccessViaToast('Categoria actualizado', 'Categoria actualizada correctamente');
            this.hideDialog();
            this.categoria = {} as Categoria;
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al actualizar la categoria');
            this.hideDialog();
            this.categoria = {} as Categoria;
        });
    }


    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
        this.isEdit = false;
    }

    deleteProduct() {
        this.showLoader('Eliminando categoria');
        this.fireService.deleteDoc('categorias', this.categoria.ID!).then(() => {
            let _categorias = this.categorias();
            let index = this.findIndexById(this.categoria.ID!);
            _categorias.splice(index, 1);
            this.categorias.set(_categorias);
            this.clear();
            this.showSuccessViaToast('Categoria eliminada', 'Categoria eliminada correctamente');
        }).catch((er) => {
            console.log(er);
            this.clear();
            this.showErrorViaToast('Error', 'Error al eliminar la categoria');
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.categorias().length; i++) {
            if (this.categorias()[i].ID === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    openConfirmation(categoria: Categoria) {
        this.categoria = categoria;
        this.displayConfirmation = true;
    }

    closeConfirmation() {
        this.displayConfirmation = false;
    }

}
