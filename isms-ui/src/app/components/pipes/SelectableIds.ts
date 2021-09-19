import { Pipe, PipeTransform } from '@angular/core';
import {SelectableItem} from "../form-element/form-element.component";
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'selectableIds'})
export class SelectableIdsPipe implements PipeTransform {
  transform(items: SelectableItem[]): number[] {
    let ids = [];
    for (let item of items) {
      ids.push(item.value);
    }
    console.log(ids)
    return ids;
  }
}
