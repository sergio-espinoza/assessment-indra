import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Routes } from '@angular/router';
import { NormalLink } from '../../shared/interfaces';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="flex-rw">
      @for (link of links; track link.route) {
        <a class="plain-link material-box" [routerLink]="link.route">{{ link.title }}</a>
      }
    </div>
    <router-outlet />
  `
})
export class ProductComponent {
  public links: NormalLink[] = [
    { route: './list', title: 'LISTA DE PRODUCTOS' }
  ];
}

const componentsTheoryRoutes: Routes = [
  {
    path: '', component: ProductComponent, children: [
      {
        path: 'list',
        loadChildren: () => import('./product-list/product-list.routes')
      },
      {
        path: 'detail/:id',
        loadChildren: () => import('./product-detail/product-detail.routes')
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

export default componentsTheoryRoutes;
