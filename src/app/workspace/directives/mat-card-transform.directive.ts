import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMatCardTransform]',
})
export class MatCardTransformDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.transform = 'scale3d(1.03, 1.03, 1)';
    this.transition();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.transform = 'scale3d(1, 1, 1)';
    this.transition();
  }

  private transition() {
    this.el.nativeElement.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
  }
}
