import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductItemComponent } from '../product-item/product-item.component';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Product, ProductResponse } from '../product.interface';
import { DEFAULT_LIMIT_SIZE, INITIAL_PAGE } from '../product.constant';
import { ProductService } from '../services';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterOutlet, ProductItemComponent, AsyncPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private _router = inject(Router);
  private _productSvc = inject(ProductService);

  productLimit = signal(DEFAULT_LIMIT_SIZE);
  productPage = signal(INITIAL_PAGE);

  products$ = of<Product[]>([]);

  constructor() {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  goToDetail(id: string) {
    this._router.navigate(['product', 'detail', id]);
  }

  loadProducts() {
    const params = {
      limit: `${this.productLimit()}`,
      skip: `${this.productPage()}`,
    }

    this.products$ = this._productSvc.getProducts$(params);
  }
}
