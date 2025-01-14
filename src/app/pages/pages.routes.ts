import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EgresosComponent } from './egresos/egresos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { IngresosComponent } from './ingresos/ingresos.component';
import { TarjetasComponent } from './tarjetas/tarjetas.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' },

    // { path: 'egresos', component: EgresosComponent },
    // { path: 'ingresos', component: IngresosComponent },
    // { path: 'categorias', component: CategoriasComponent },
    // { path: 'tarjetas', component: TarjetasComponent },

] as Routes;
