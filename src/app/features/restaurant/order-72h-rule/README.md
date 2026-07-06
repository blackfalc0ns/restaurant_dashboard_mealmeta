# Restaurant — F06: Order 72h Rule

## الصفحات

| الصفحة | المسار | الغرض |
|--------|--------|-------|
| `PendingConfirmationPage` | `/restaurant/orders/pending-confirmation` | طلبات −72h بانتظار التأكيد (24h) |
| `Upcoming24hPage` | `/restaurant/orders/upcoming-24h` | قائمة توصيل −24h والتحضير |
| `Order72hDetailPage` | `/restaurant/orders/:id/72h` | تفاصيل طلب + عدّاد التأكيد |

## API (MVP)

- `GET /api/restaurant/orders`
- `GET /api/restaurant/orders/{id}`
- `POST /api/restaurant/orders/{id}/confirm`
- `POST /api/restaurant/orders/{id}/reject-confirmation`
- `GET /api/restaurant/orders/upcoming-24h`

## القيود

- بيانات المطعم الحالي فقط (ownership).
- تعطيل التأكيد عند عدم اعتماد الحساب/القائمة/المنطقة.

## UX States

كل صفحة: `loading` | `empty` | `error` | `retry` | `success`
