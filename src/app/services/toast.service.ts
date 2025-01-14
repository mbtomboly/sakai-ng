import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

showSuccess(titulo: string, mensaje: string) {
    this.messageService.add({ severity: 'success', summary: titulo, detail: mensaje });
}

showInfo(titulo: string, mensaje: string) {
    this.messageService.add({ severity: 'info', summary: titulo, detail: mensaje });
}

showWarn(titulo: string, mensaje: string) {
    this.messageService.add({ severity: 'warn', summary: titulo, detail: mensaje });
}

showError(titulo: string, mensaje: string) {
    this.messageService.add({ severity: 'error', summary: titulo, detail: mensaje });
}

showContrast(titulo: string, mensaje: string) {
    this.messageService.add({ severity: 'contrast', summary: titulo, detail: mensaje });
}

showSecondary(titulo: string, mensaje: string) {
    this.messageService.add({ severity: 'secondary', summary: titulo, detail: mensaje });
}

}
