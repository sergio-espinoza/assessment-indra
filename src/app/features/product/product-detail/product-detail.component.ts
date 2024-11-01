import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../services';
import { Router } from 'express';
import { Product } from '../product.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  productForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  private _ProductSvc = inject(ProductService);
  private _activateRoute = inject(ActivatedRoute)

  product: WritableSignal<Product | null> = signal(null);

  ngOnInit() {
    this._activateRoute.paramMap.pipe(
      switchMap(params => {
        return this._ProductSvc.getProductById$(params.get('id') || '');
      })
    ).subscribe(
      response => this.product.set(response)
    );
  }

  updateProduct() {
    this._ProductSvc.updateProduct$(
      `${this.product()?.id}`, this.productForm.value as Partial<Product>
    ).subscribe(
      response => this.product.set(response)
    );
  }

}
