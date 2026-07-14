import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-service-region-detail-skeleton',
  standalone: true,
  template: `
    <div class="mm-ops-skeleton__inner" aria-hidden="true">
      <div class="mm-ops-skeleton__detail-hero">
        <div class="mm-ops-skeleton__detail-top">
          <div class="mm-ops-skeleton__detail-copy">
            <span class="mm-ov-bone mm-ov-bone--chip"></span>
            <span class="mm-ov-bone mm-ov-bone--title"></span>
            <span class="mm-ov-bone mm-ov-bone--line mm-ov-bone--mid"></span>
          </div>
          <div class="mm-ops-skeleton__detail-actions">
            <span class="mm-ov-bone mm-ov-bone--btn"></span>
            <span class="mm-ov-bone mm-ov-bone--btn"></span>
          </div>
        </div>
        <div class="mm-ops-skeleton__metrics mm-ops-skeleton__metrics--detail">
          @for (item of metricPlaceholders; track item) {
            <div class="mm-ops-skeleton__metric">
              <span class="mm-ov-bone mm-ov-bone--line mm-ov-bone--short"></span>
              <span class="mm-ov-bone mm-ov-bone--value"></span>
            </div>
          }
        </div>
      </div>

      <div class="mm-ops-skeleton__split">
        <div class="mm-ops-skeleton__board">
          <span class="mm-ov-bone mm-ov-bone--line mm-ov-bone--short"></span>
          @for (item of rowPlaceholders; track item) {
            <div class="mm-ops-skeleton__feed-row">
              <span class="mm-ov-bone mm-ov-bone--avatar"></span>
              <div class="mm-ops-skeleton__card-copy">
                <span class="mm-ov-bone mm-ov-bone--line mm-ov-bone--short"></span>
                <span class="mm-ov-bone mm-ov-bone--line"></span>
              </div>
              <span class="mm-ov-bone mm-ov-bone--chip"></span>
            </div>
          }
        </div>
        <div class="mm-ops-skeleton__side">
          @for (item of sidePlaceholders; track item) {
            <div class="mm-ops-skeleton__board">
              <span class="mm-ov-bone mm-ov-bone--line mm-ov-bone--short"></span>
              <span class="mm-ov-bone mm-ov-bone--line"></span>
              <span class="mm-ov-bone mm-ov-bone--block"></span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ops-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .mm-ops-skeleton__inner {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 1rem;
      }

      .mm-ops-skeleton__detail-hero {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border-radius: 1.4rem;
        border: 1px solid rgba(4, 153, 78, 0.12);
        background: linear-gradient(145deg, #ffffff 0%, #f3fbf6 58%, #edf8f1 100%);
        padding: 1.25rem;
      }

      .mm-ops-skeleton__detail-top {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
      }

      .mm-ops-skeleton__detail-copy {
        flex: 1 1 16rem;
        min-width: 12rem;
      }

      .mm-ops-skeleton__detail-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .mm-ops-skeleton__detail-actions .mm-ov-bone--btn {
        margin-top: 0;
      }

      .mm-ops-skeleton__metrics {
        display: grid;
        grid-template-columns: repeat(3, minmax(4.75rem, 1fr));
        gap: 0.5rem;
      }

      .mm-ops-skeleton__metrics--detail {
        grid-template-columns: repeat(2, minmax(4.75rem, 1fr));
        width: 100%;
      }

      @media (min-width: 640px) {
        .mm-ops-skeleton__metrics--detail {
          grid-template-columns: repeat(4, minmax(4.75rem, 1fr));
        }
      }

      .mm-ops-skeleton__metric {
        min-width: 4.75rem;
        border-radius: 0.75rem;
        border: 1px solid #d9ebe1;
        background: #fff;
        padding: 0.75rem 0.875rem;
      }

      .mm-ops-skeleton__split {
        display: grid;
        gap: 1rem;
      }

      @media (min-width: 1280px) {
        .mm-ops-skeleton__split {
          grid-template-columns: minmax(0, 1.4fr) minmax(17rem, 0.8fr);
        }
      }

      .mm-ops-skeleton__board {
        border-radius: 1.35rem;
        border: 1px solid rgba(4, 153, 78, 0.1);
        background: #fff;
        padding: 1.25rem;
      }

      .mm-ops-skeleton__side {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .mm-ops-skeleton__feed-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.75rem;
        border-radius: 1rem;
        border: 1px solid #e4eee8;
        background: #fbfefc;
        padding: 0.875rem;
      }

      .mm-ops-skeleton__card-copy {
        flex: 1 1 auto;
        min-width: 8rem;
      }
    `,
  ],
})
export class ServiceRegionDetailSkeletonComponent {
  readonly metricPlaceholders = [1, 2, 3, 4];
  readonly rowPlaceholders = [1, 2, 3, 4];
  readonly sidePlaceholders = [1, 2];
}
