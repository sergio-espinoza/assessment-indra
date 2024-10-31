import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductItemComponent } from '../product-item/product-item.component';
import { debounceTime, distinctUntilChanged, filter, map, of, Subscription, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Product, ProductResponse } from '../product.interface';
import { DEFAULT_LIMIT_SIZE, INITIAL_PAGE } from '../product.constant';
import { ProductService } from '../services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators as Vl } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterOutlet, ProductItemComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {
  private _router = inject(Router);
  private _productSvc = inject(ProductService);

  filterForm = new FormGroup({
    search: new FormControl('', [Vl.required]),
    limit: new FormControl(DEFAULT_LIMIT_SIZE),
    page: new FormControl(INITIAL_PAGE)
  });

  products$ = of<Product[]>([]);

  subscriptions = new Subscription();

  constructor() {
  }

  ngOnInit(): void {
    this.initSearchHandler();
    this.loadProducts();
  }

  goToDetail(id: string) {
    this._router.navigate(['product', 'detail', id]);
  }

  remove(id: string) {
    this._productSvc.removeProduct$(id).pipe(
      switchMap(
        () => this._productSvc.searchProducts$(this.getParamsToSearch())
      ),
      map(response => response.filter(
        item => !this._productSvc.getRemovedProducts().includes(`${item.id}`)
      ))
    ).subscribe(response => this.products$ = of(response));
  }

  initSearchHandler() {
    let currentSearchText = '';
    let currentPage = INITIAL_PAGE;

    const filterSubscription = this.filterForm.valueChanges.pipe(
      debounceTime(500),
      filter(value => {
        if (currentPage !== value.page) return true;

        return currentSearchText !== value.search && (value?.search || '')?.length > 3;
      }),
      map(value => {
        currentSearchText = value.search || '';
        currentPage = value.page || 0;

        return { ...value, search: currentSearchText, page: currentPage };
      }),
      switchMap(
        () => this._productSvc.searchProducts$(this.getParamsToSearch())
      ),
      map(response => response.filter(
        item => !this._productSvc.getRemovedProducts().includes(`${item.id}`)
      ))
    ).subscribe(response => this.products$ = of(response));

    this.subscriptions.add(filterSubscription);
  }

  goToPage(page: number) {
    this.filterForm.patchValue({ page });
  }

  loadProducts() {
    this.products$ = this._productSvc.getProducts$(this.getParamsToSearch()).pipe(
      map(response => response.filter(
        item => !this._productSvc.getRemovedProducts().includes(`${item.id}`)
      ))
    );
  }

  getParamsToSearch() {
    const { limit, page, search = '' } = this.filterForm.value;

    const searchText = search || '';
    const skip = `${(page || 0) * (limit || DEFAULT_LIMIT_SIZE)}`;

    return {
      limit: `${limit}`,
      skip,
      ...(searchText.length > 0 ? { q: searchText } : {})
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
