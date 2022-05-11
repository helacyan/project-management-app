import { Directive, ElementRef, HostListener } from '@angular/core';
import { Color } from 'src/app/workspace/directives/consts';

@Directive({
  selector: '[appHighlightFooterLink]',
})
export class HighlightFooterLinkDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(Color.DarkBlue);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(Color.Blue);
  }

  @HostListener('mousedown') onMouseDown() {
    this.highlight(Color.PrimaryColor);
  }

  @HostListener('mouseup') onMouseUp() {
    this.highlight(Color.Blue);
  }

  private highlight(color: string) {
    this.el.nativeElement.children[0].style.fill = color;
    this.el.nativeElement.children[1].style.color = color;
  }
}
