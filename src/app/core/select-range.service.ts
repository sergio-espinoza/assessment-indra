import { ElementRef, inject, Injectable } from '@angular/core';
import { WINDOW } from './window.token';

@Injectable({providedIn: 'root' })
export class SelectRangeService {
  private _windowRef = inject(WINDOW);
  private _documentRef = this._windowRef.document;

  setSelection(element: HTMLElement, start: number, end: number) {
    const range = document.createRange();
    const selection = this._windowRef.getSelection();

    range.setStart(element.childNodes[0], start);
    range.setEnd(element.childNodes[0], end);

    selection?.removeAllRanges();
    selection?.addRange(range);
  }

}
