import { Component, input, OnInit, Optional, output } from '@angular/core';
import { Product } from '../product.interface';
import {
  NgOptimizedImage,
  // provideImgixLoader
} from '@angular/common';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [NgOptimizedImage],
  providers: [
    // provideImgixLoader('https://cdn.dummyjson.com')
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnInit {
  product = input<Product>();
  editedProduct = input<Product | undefined>();

  toDetail = output<string>();
  toRemove = output<string>();

  ngOnInit(): void {
  }

  goToDetail(id: number | string) {
    this.toDetail.emit(`${id}`);
  }

  remove(id: number | string) {
    this.toRemove.emit(`${id}`);
  }


}
