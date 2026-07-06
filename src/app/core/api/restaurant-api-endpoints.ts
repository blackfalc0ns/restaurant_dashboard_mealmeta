/** Restaurant API paths — F06 order confirmation and preparation. */
export const RestaurantApiEndpoints = {
  orders: '/api/restaurant/orders',
  orderById: (orderId: string) => `/api/restaurant/orders/${orderId}`,
  confirmOrder: (orderId: string) =>
    `/api/restaurant/orders/${orderId}/confirm`,
  rejectConfirmation: (orderId: string) =>
    `/api/restaurant/orders/${orderId}/reject-confirmation`,
  upcoming24h: '/api/restaurant/orders/upcoming-24h',
} as const;
