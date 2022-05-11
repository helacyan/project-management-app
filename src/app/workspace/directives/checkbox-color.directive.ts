import { Directive, ElementRef, Input } from '@angular/core';
import { Color } from './consts';

@Directive({
  selector: '[appCheckboxColor]',
})
export class CheckboxColorDirective {
  constructor(private el: ElementRef) {}

  @Input() set appCheckboxColor(done: boolean) {
    if (done) {
      this.el.nativeElement.style.backgroundColor = Color.PrimaryColor;
      this.el.nativeElement.style.color = Color.White;
    }
  }
}
