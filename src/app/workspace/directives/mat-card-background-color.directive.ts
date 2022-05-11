import { Directive, ElementRef, Input } from '@angular/core';
import { Color } from './consts';

@Directive({
  selector: '[appMatCardBackgroundColor]',
})
export class MatCardBackgroundColorDirective {
  constructor(private el: ElementRef) {}

  @Input() set appMatCardBackgroundColor(isTaskOwnByCurrentUser: boolean) {
    if (!isTaskOwnByCurrentUser) {
      this.el.nativeElement.style.backgroundColor = Color.GrayLight;
    }
  }
}
