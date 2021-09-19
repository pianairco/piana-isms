import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[inputMask]'
})
export class InputMaskDirective implements OnInit {
//  this list contains key codes of events we like to ignore here. we will be able to use arrow keys,
  //  delete etc.
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Clear',
    'Copy', 'Control', 'Del', 'Shift', 'ArrowLeft', 'ArrowLeft'];

  //  externally configured regex - for numbers shall be:  /^[0-9]+(\.[0-9]*){0,1}$/g
  @Input('inputMask') inputMask: string;


  private regex: RegExp;

  constructor(private el: ElementRef) {
  }

  // initialise regex here, input parameters are not yet set while construction
  ngOnInit() {
    this.regex = new RegExp(this.inputMask, "g");
  }
  //  and here happens everything
  //  ... subscribe to keydown events
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    // we are working with event.key here - as char atribute is deprecated
    // we exclude out special keys,  and all the specials.
    if (this.specialKeys.indexOf(event.key) !== -1 || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }



    // current string in element
    let current: string = this.el.nativeElement.value;

    // compose what our text will become if we let it pass.
    // Do not use event.keycode this is deprecated.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // take selection  boundaries into consideration -  input replaces what is in between.
    let next: string = current.substring(0, this.el.nativeElement.selectionStart) + event.key + current.substring(this.el.nativeElement.selectionEnd)

    //  if it does not match, we do not let it pass
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
