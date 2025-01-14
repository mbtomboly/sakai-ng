import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-primetoast',
  templateUrl: './primetoast.component.html',
  styleUrl: './primetoast.component.scss',
  standalone: true,
  imports: [Toast, ButtonModule, Ripple, PrimetoastComponent],
  providers: [MessageService]
})
export class PrimetoastComponent {

    constructor(private messageService: MessageService) {}

    public showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }

    public showInfo() {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content' });
    }

    public showWarn() {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
    }

    public showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
    }

    public showContrast() {
        this.messageService.add({ severity: 'contrast', summary: 'Error', detail: 'Message Content' });
    }

    public showSecondary() {
        this.messageService.add({ severity: 'secondary', summary: 'Secondary', detail: 'Message Content' });
    }

}
