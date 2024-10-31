import { Component, input, output } from '@angular/core';
import { Product } from '../product.interface';

@Component({
  selector: 'app-product-item',
  standalone: true,
  // imports: [],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  product = input<Product>();

  toDetail = output<string>();
  toRemove = output<string>();

  goToDetail(id: number | string) {
    this.toDetail.emit(`${id}`);
  }

  remove(id: number | string) {
    this.toRemove.emit(`${id}`);
  }

}
