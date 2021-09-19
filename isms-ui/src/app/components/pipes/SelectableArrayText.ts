import {Pipe, PipeTransform} from '@angular/core';
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
@Pipe({name: 'selectableArrayText'})
export class SelectableArrayTextPipe implements PipeTransform {
  transform(items: SelectableItem[]): string {
    let str = "";
    if(!items)
      return str;
    for (let item of items) {
      str += item.title + ":" + item.value + "\n";
    }
    console.log(str)
    return str;
  }
}
