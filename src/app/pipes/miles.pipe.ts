import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'miles',
  standalone: true
})
export class MilesPipe implements PipeTransform {

  private THOUSANDS_SEPARATOR = '.';
  private GROUP_SEPARATOR = '.';
  DECIMAL_SEPARATOR = '.';


  transform(value: number | string | undefined): string {
    const integer = (value || '').toString();

    const parts = this.unFormat(integer).split(this.DECIMAL_SEPARATOR);

    const newValue = parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR);

    return newValue;

    // integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

    // return integer;
  }

  unFormat(val: any) {
    if (!val) {
        return '';
    }
    val = val.replace(/^0+/, '').replace(/\D/g, '');
        return val.replace(/\./g, '');
  }
  }

