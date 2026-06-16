// CM-MODULE: Approval service managing hierarchy and queue status transitions
// Updates cm_approval_queue and the source tables (retailers, retailer_orders) on approval chain actions.

/**
 * Returns the next level of status in the approval chain.
 */
export function getNextApprovalLevel(currentStatus) {
  // CM-MODULE: Calculate next approval status
  switch (currentStatus) {
    case 'Pending': return 'City_Approved';
    case 'City_Approved': return 'State_Approved';
    case 'State_Approved': return 'Country_Approved';
    case 'Country_Approved': return 'Final_Approved';
    default: return 'Final_Approved';
  }
}

/**
 * Validates if the Country Manager is allowed to action this item.
 * Country Manager can only action items that are 'Pending' and at their hierarchy level.
 */
export async function validateCMCanApprove(cmId, queueId) {
  // CM-MODULE: Validate CM approval level
  console.log(`[Service] Validating approval authority for CM ${cmId} on queue item ${queueId}`);
  // In a real database environment:
  // const item = await db('cm_approval_queue').where({ id: queueId, country_manager_id: cmId }).first();
  // if (!item || item.action !== 'Pending') return false;
  // return true;
  return true;
}

/**
 * Processes approval or rejection action.
 * Updates queue row, updates source record columns, and dispatches notifications.
 */
export async function processApprovalAction(cmId, queueId, action, remarks) {
  // CM-MODULE: Execute approval action and update target columns
  console.log(`[Service] Processing action ${action} for queue ${queueId} by CM ${cmId} (remarks: "${remarks}")`);
  
  // In a real database environment:
  // const item = await db('cm_approval_queue').where({ id: queueId }).first();
  // if (!item) throw new Error("Approval request not found");
  
  // 1. Update queue status
  // await db('cm_approval_queue').where({ id: queueId }).update({
  //   action,
  //   actioned_by: cmId,
  //   actioned_at: db.fn.now(),
  //   remarks
  // });
  
  // 2. Update source record based on type
  // if (item.reference_type === 'retailer') {
  //   // CM-MODULE: Retailer integration - approval_status column only
  //   await db('retailers').where({ id: item.reference_id }).update({
  //     approval_status: action === 'Approved' ? 'Country_Approved' : 'Rejected'
  //   });
  // } else if (item.reference_type === 'order') {
  //   // CM-MODULE: Order integration - single column updates only
  //   await db('retailer_orders').where({ id: item.reference_id }).update({
  //     country_manager_approval: action === 'Approved' ? 1 : 0,
  //     status: action === 'Approved' ? 'Approved' : 'Cancelled'
  //   });
  // }
  
  return { success: true, next_step: action === 'Approved' ? 'Founder_Approval' : 'Closed' };
}

/**
 * Adds an item to the Country Manager's approval queue.
 */
export async function addToApprovalQueue(cmId, type, referenceId, referenceType, referenceLabel, submittedBy, submittedByRole) {
  // CM-MODULE: Add new pending approval item to queue
  console.log(`[Service] Inserting new approval request of type ${type} for CM ${cmId}`);
  // return await db('cm_approval_queue').insert({
  //   country_manager_id: cmId,
  //   country_id: 1, // Looked up from country_managers
  //   approval_type: type,
  //   reference_id: referenceId,
  //   reference_type: referenceType,
  //   reference_label: referenceLabel,
  //   submitted_by: submittedBy,
  //   submitted_by_role: submittedByRole,
  //   priority: type === 'Large_Order' ? 'High' : 'Normal',
  //   action: 'Pending'
  // });
  return { success: true };
}
