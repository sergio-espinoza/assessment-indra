import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductItemComponent } from '../product-item/product-item.component';
import { debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Product, ProductResponse } from '../product.interface';
import { DEFAULT_LIMIT_SIZE, INITIAL_PAGE } from '../product.constant';
import { ProductService } from '../services';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterOutlet, ProductItemComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private _router = inject(Router);
  private _productSvc = inject(ProductService);

  searchControl = new FormControl('');

  productLimit = signal(DEFAULT_LIMIT_SIZE);
  productPage = signal(INITIAL_PAGE);

  products$ = of<Product[]>([]);

  constructor() {
  }

  ngOnInit(): void {
    this.initSearchHandler();
    this.loadProducts();
  }

  goToDetail(id: string) {
    this._router.navigate(['product', 'detail', id]);
  }

  initSearchHandler() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(value => (value || '')?.length > 3),
      switchMap(
        value => this._productSvc.searchProducts$(this.getParamsToSearch(value || ''))
      )
    ).subscribe(response => this.products$ = of(response));
  }

  loadProducts() {
    const params = {
      limit: `${this.productLimit()}`,
      skip: `${this.productPage()}`,
    }

    this.products$ = this._productSvc.getProducts$(params);
  }

  getParamsToSearch(searchString: string) {
    return {
      limit: `${this.productLimit()}`,
      skip: `${this.productPage()}`,
      q: searchString
    }
  }
}
