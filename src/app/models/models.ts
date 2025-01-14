export interface Egreso {
    nombre: string;
    categoria: string;
    monto: number;
    contado: boolean;
    tarjeta?: string;
    fecha?: Date;
    pagado?: boolean;
    ID?: string;
  }

  export interface Tarjeta {
    nombre: string;
    titular: 'Mariano' | 'Melany',
    limite?: number;
    disponible?: number;
    ID?: string;
  }

  export interface Categoria {
    nombre: string;
    ID?: string;
  }
