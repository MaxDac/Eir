import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appNameChangingDirective]'
})
export class NameChangingDirectiveDirective {

  constructor(element: ElementRef) {
    element.nativeElement.innerText = 'surprise!';
  }

}
