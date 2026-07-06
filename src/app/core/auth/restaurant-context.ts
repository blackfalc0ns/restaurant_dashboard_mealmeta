/** Restaurant ownership context — UI relies on backend for enforcement. */
export interface RestaurantContext {
  restaurantId: string;
  isApproved: boolean;
  hasApprovedMenu: boolean;
  hasServiceArea: boolean;
}

export function canConfirmOrders(context: RestaurantContext): boolean {
  return (
    context.isApproved && context.hasApprovedMenu && context.hasServiceArea
  );
}
