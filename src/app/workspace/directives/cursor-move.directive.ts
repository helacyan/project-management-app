import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appCursorMove]',
})
export class CursorMoveDirective {
  constructor(private el: ElementRef) {}

  @Input() set appCursorMove(cdkDragDisabled$: boolean | null) {
    if (!cdkDragDisabled$) {
      this.el.nativeElement.style.cursor = 'move';
    }
  }
}
