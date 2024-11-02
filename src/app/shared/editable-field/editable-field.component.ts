import {
  AfterContentInit,
  Component,
  contentChild,
  ElementRef,
  Input,
  input,
  OnDestroy,
  output
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-editable-field',
  standalone: true,
  templateUrl: './editable-field.component.html',
  styleUrl: './editable-field.component.scss',
  imports: [ReactiveFormsModule]
})
export class EditableFieldComponent implements AfterContentInit, OnDestroy {
  controlName = input('');
  editableContent = contentChild<any, ElementRef<HTMLElement>>('editableContentEl', { read: ElementRef });

  @Input()
  form!: FormGroup;

  toActive = output<HTMLElement>();

  subscription = new Subscription();

  ngAfterContentInit(): void {

    const editableEl = this.getEditableEl();

    if (!editableEl) return;

    const blurEditableSub = fromEvent(editableEl, 'blur').subscribe(() => {
      this.inactiveEditable(editableEl);
      this.form.patchValue({ [this.controlName()]: editableEl.innerText || '' });
    });

    this.subscription.add(blurEditableSub);
  }

  activeEditable() {
    const editableEl = this.getEditableEl();

    if (!editableEl) return;

    editableEl.setAttribute('contenteditable', 'true');
    this.toActive.emit(editableEl);

    setTimeout(() => {
      editableEl?.focus();
    });
  }

  inactiveEditable(editableEl: HTMLElement) {
    editableEl.setAttribute('contenteditable', null as any);
  }

  getEditableEl() {
    const editableContent = this.editableContent();
    return editableContent?.nativeElement;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
