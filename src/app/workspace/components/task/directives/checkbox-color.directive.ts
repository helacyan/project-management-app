import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appCheckboxColor]',
})
export class CheckboxColorDirective {
  constructor(private el: ElementRef) {}

  @Input() set appCheckboxColor(done: boolean) {
    if (done) {
      this.el.nativeElement.style.backgroundColor = '#0d47a1';
      this.el.nativeElement.style.color = 'white';
    }
  }
}
