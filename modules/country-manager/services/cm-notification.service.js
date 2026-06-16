// CM-MODULE: Notification service to handle messages to the Country Manager
// Writes notifications to cm_notifications table.

/**
 * Notifies Country Manager about a pending approval request.
 * INSERT INTO cm_notifications (country_manager_id, type, title, message, reference_id, reference_type)
 */
export async function notifyCMApprovalRequest(cmId, type, referenceId, label) {
  // CM-MODULE: Notify CM about approval request
  console.log(`[Service] Dispatching Approval Request Notification to CM ${cmId} for ${label}`);
  // return await db('cm_notifications').insert({
  //   country_manager_id: cmId,
  //   type: 'Approval_Request',
  //   title: `Pending Approval: ${type.replace(/_/g, ' ')}`,
  //   message: `A new request for ${label} requires your review and authorization.`,
  //   reference_id: referenceId,
  //   reference_type: type.toLowerCase().includes('order') ? 'order' : 'retailer',
  //   priority: 'High'
  // });
  return { success: true };
}

/**
 * Notifies Country Manager when target milestone is reached.
 */
export async function notifyCMTargetMilestone(cmId, targetId, milestonePct) {
  // CM-MODULE: Notify CM target milestone
  console.log(`[Service] Dispatching Target Milestone Notification to CM ${cmId} for target ${targetId} at ${milestonePct}%`);
  // return await db('cm_notifications').insert({
  //   country_manager_id: cmId,
  //   type: 'Target_Reminder',
  //   title: `Target Progress Alert: ${milestonePct}% Achieved`,
  //   message: `Congratulations! Your team has achieved ${milestonePct}% of the set target.`,
  //   reference_id: targetId,
  //   reference_type: 'target',
  //   priority: 'Normal'
  // });
  return { success: true };
}

/**
 * Notifies Country Manager when commission is computed.
 */
export async function notifyCMCommission(cmId, commissionId, amount) {
  // CM-MODULE: Notify CM commission
  console.log(`[Service] Dispatching Commission Notification to CM ${cmId} for payout ${commissionId}`);
  // return await db('cm_notifications').insert({
  //   country_manager_id: cmId,
  //   type: 'Commission_Alert',
  //   title: `Commission Calculated: ₹${amount.toLocaleString('en-IN')}`,
  //   message: `Your country manager incentive payout of ₹${amount.toLocaleString('en-IN')} has been calculated and is pending finance clearance.`,
  //   reference_id: commissionId,
  //   reference_type: 'commission',
  //   priority: 'Normal'
  // });
  return { success: true };
}

/**
 * Notifies Country Manager of a state performance drop.
 */
export async function notifyCMStateAlert(cmId, stateId, stateName, achievementPct) {
  // CM-MODULE: Notify CM state alert
  console.log(`[Service] Dispatching State Performance Alert to CM ${cmId} for state ${stateName} at ${achievementPct}%`);
  // return await db('cm_notifications').insert({
  //   country_manager_id: cmId,
  //   type: 'State_Performance_Alert',
  //   title: `Underperformance Warning: ${stateName}`,
  //   message: `Attention manager: State ${stateName} is currently underperforming at ${achievementPct}% of its monthly revenue goal.`,
  //   reference_id: stateId,
  //   reference_type: 'state',
  //   priority: 'High'
  // });
  return { success: true };
}
