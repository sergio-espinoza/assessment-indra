import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../services';
import { Product } from '../product.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { EditableFieldComponent } from '../../../shared/editable-field';
import { NgOptimizedImage } from '@angular/common';
import { SelectRangeService } from '../../../core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [EditableFieldComponent, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  productForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  private _SelectRangeSvc = inject(SelectRangeService);
  private _ProductSvc = inject(ProductService);
  private _activateRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  product: WritableSignal<Product | null> = signal(null);

  ngOnInit() {
    this._activateRoute.paramMap.pipe(
      switchMap(params => {
        return this._ProductSvc.getProductById$(params.get('id') || '');
      })
    ).subscribe(data => this.updateProductForm(data as Product));
  }

  activeEditable(element: HTMLElement, controlName: 'title' | 'description') {
    const contentLength = this.productForm.value[controlName]?.length || 0;

    this._SelectRangeSvc.setSelection(element, contentLength, contentLength);
  }

  sendToUpdate() {
    this._ProductSvc.updateProduct$(
      `${this.product()?.id}`, this.productForm.value as Partial<Product>
    ).subscribe(() => this._router.navigate(['product', 'list']));
  }

  updateProductForm(newProduct: Product) {
    this.product.set(newProduct);

    this.productForm.patchValue({
      title: newProduct.title || '',
      description: newProduct.description || ''
    });
  }

}
