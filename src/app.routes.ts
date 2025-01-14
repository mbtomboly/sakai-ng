import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { EgresosComponent } from './app/pages/egresos/egresos.component';
import { IngresosComponent } from './app/pages/ingresos/ingresos.component';
import { CategoriasComponent } from './app/pages/categorias/categorias.component';
import { TarjetasComponent } from './app/pages/tarjetas/tarjetas.component';
import { DocumentosComponent } from './app/pages/documentos/documentos.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'egresos', component: EgresosComponent },
            { path: 'ingresos', component: IngresosComponent },
            { path: 'categorias', component: CategoriasComponent },
            { path: 'tarjetas', component: TarjetasComponent },
            { path: 'gastos-tarjeta', component: TarjetasComponent },
            { path: 'documentos', component: DocumentosComponent },
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },


    { path: '**', redirectTo: '/' },
];
