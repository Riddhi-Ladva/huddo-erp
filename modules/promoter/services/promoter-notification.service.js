// PROMO-MODULE: Backend service mock to dispatch type-specific promoter notification logs.

export async function sendPromoterNotification(promoterId, type, title, message) {
  // PROMO-MODULE: Inserts a type-specific log under promoter_notifications.
  return {
    success: true,
    notificationId: 1
  };
}
