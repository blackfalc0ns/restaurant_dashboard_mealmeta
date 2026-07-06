import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageViewState } from '../../models/page-view-state.model';

@Component({
  selector: 'mm-page-state',
  standalone: true,
  templateUrl: './page-state.component.html',
  styleUrl: './page-state.component.scss',
})
export class PageStateComponent {
  @Input({ required: true }) viewState!: PageViewState;
  @Input() errorMessage = 'حدث خطأ غير متوقع';
  @Input() emptyMessage = 'لا توجد بيانات';
  @Output() retry = new EventEmitter<void>();
}
