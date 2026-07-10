import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-restaurant-empty-page',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantEmptyPageComponent {}
