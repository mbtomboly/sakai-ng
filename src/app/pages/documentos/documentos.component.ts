import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { FirestoreService } from '../../services/firestore.service';
import { InputTextModule } from 'primeng/inputtext';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Select } from 'primeng/select';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';


interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [
    ToolbarModule,
    FormsModule,
    ButtonModule,
    TreeTableModule,
    TreeModule,
    InputTextModule,
    Select,
    FileUpload
  ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent implements OnInit {

    documentos: TreeNode[] = [];

    carpeta: any = {};
    carpetas: any = [];
    event: any;

    loading = true;

    doc: any = {};

    uploadedFileURL: string = '';

    selectedFile: any;
    fileCarpeta: any;
    selectedCarpeta: any;

    constructor(private fireService: FirestoreService, private storage: AngularFireStorage) {

    }

    ngOnInit(): void {
        this.getCarpetas();
    }

    onUpload(event: any) {
        console.log(event);
        this.event = event;
    }

    upload() {
        console.log(this.doc);
        console.log(this.event);
        this.uploadFile(this.event);
    }

    uploadFile(event: any) {
        const file = event.target.files[0];
        const filePath = `documentos/${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                this.uploadedFileURL = url;
                let docu: any = {};
                docu.url = url;
                docu.nombre = file.name;
                this.fireService.createDeepDoc('carpetas', this.doc.carpeta.ID, 'documentos', docu).then((data) => {
                    console.log(data);
                }).catch((er) => {
                    console.log(er);
                })
              });
            })
          )
          .subscribe();
      }

      getFileURL() {
        return this.uploadedFileURL;
      }

      dbl() {
        console.log('double');

      }


    createCarpeta() {
        this.fireService.createDoc('carpetas', this.carpeta).then((data) => {
            console.log(data);
            this.carpeta = {};
        }).catch((er) => {
            console.log(er);
        });
    }

    createDoc() {
        this.fireService.createDeepDoc('carpetas', this.carpeta.ID, 'documentos', this.doc).then((data) => {
            console.log(data);
        }).catch((er) => {
            console.log(er);
        })
    }

    unselect() {
        this.selectedCarpeta = null;
        this.selectedFile = null;
        this.fileCarpeta = null;
    }

    select(event: any) {
        this.selectedCarpeta = null;
        this.selectedFile = null;
        this.fileCarpeta = null;
        console.log(event);
        if (!event.node.value) {
            console.log('parent');
            this.selectedCarpeta = event.node.label;
        } else {
            console.log('children');
            this.fileCarpeta = event.node.parent.label;
            this.selectedFile = event.node.value;
        }
    }

    openFile() {
        window.open(this.selectedFile.url, '_blank');
    }

    deleteFile() {
        this.loading = true;
        let folder =  this.carpetas.find((it: any) => it.nombre === this.fileCarpeta);
        let docu = this.documentos.find((it: any) => it.label === this.fileCarpeta);
        let i = this.documentos.indexOf(docu!);
        let child = docu?.children?.find((it: any) => it.label === this.selectedFile.nombre);
        let j = docu?.children?.indexOf(child!);
        this.fireService.deleteDeepDoc('carpetas', folder.ID, 'documentos', this.selectedFile.ID).then((data) => {
            console.log(data);
            this.documentos[i].children!.splice(j!, 1);
            this.loading = false;
            this.selectedCarpeta = null;
            this.selectedFile = null;
            this.fileCarpeta = null;
        }).catch((er) => {
            console.log(er);
            this.loading = false;
            this.selectedCarpeta = null;
            this.selectedFile = null;
            this.fileCarpeta = null;
        })
    }

    deleteFolder() {
        this.loading = true;
        let folder = this.carpetas.find((it: { nombre: any; }) => it.nombre === this.selectedCarpeta);
        let docu = this.documentos.find((it: any) => it.label === this.selectedCarpeta);
        let i = this.documentos.indexOf(docu!);
        this.fireService.deleteDoc('carpetas', folder.ID).then((data) => {
            this.documentos.splice(i, 1);
            console.log(data);
            this.loading = false;
            this.selectedCarpeta = null;
            this.selectedFile = null;
            this.fileCarpeta = null;
        }).catch((er) => {
            console.log(er);
            this.loading = false;
            this.selectedCarpeta = null;
            this.selectedFile = null;
            this.fileCarpeta = null;
        })
    }

    getCarpetas() {
        this.fireService.getDocs('carpetas').then((data) => {
            this.carpetas = data;
            data.forEach((element: { nombre: any; ID: any}) => {
                let tree: any = {};
                tree.label = element.nombre;
                tree.children = [];
                this.documentos.push(tree);
                this.fireService.getDeepDocs('carpetas', element.ID, 'documentos').then((docs) => {
                    docs.forEach((doc: { nombre: any; }) => {
                        let d: any = {};
                        d.label = doc.nombre;
                        d.value = doc;
                        tree.children.push(d);
                    });
                });
            this.loading = false;
        }).catch((er: any) => {
            console.log(er);
        })
    });
    }

}
