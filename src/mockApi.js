// HUDDO-UPDATE: Core — Mock API engine intercepting fetch globally
import { GEOGRAPHY, initialOrders, initialInvoices, initialEmployees, initialRetailers, initialInventory, initialDepartmentsDetails } from './mockData';

// Helper to initialize local storage data if not present
const getOrSetLocal = (key, defaultVal) => {
  const existing = localStorage.getItem(key);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (e) {
      console.error("Error parsing local storage key", key, e);
    }
  }
  localStorage.setItem(key, JSON.stringify(defaultVal));
  return defaultVal;
};

// Initialize persistent mock collections
let orders = getOrSetLocal('huddo_orders', initialOrders);
let invoices = getOrSetLocal('huddo_invoices', initialInvoices);
let employees = getOrSetLocal('huddo_employees', initialEmployees);
let retailers = getOrSetLocal('huddo_retailers', initialRetailers);
let inventory = getOrSetLocal('huddo_inventory', initialInventory);
let departments = getOrSetLocal('huddo_departments', initialDepartmentsDetails);
let returnLogs = getOrSetLocal('huddo_return_logs', []);
let pettyCash = getOrSetLocal('huddo_petty_cash', [
  { id: 1, date: "2026-06-11", description: "Office stationary printing", category: "Stationery", type: "expense", amount: 450.00, created_by: "Rohan Hudda", notes: "Bought from local printing press", receipt_url: null },
  { id: 2, date: "2026-06-10", description: "Client travel reimbursement", category: "Travel", type: "expense", amount: 1500.00, created_by: "Rohan Hudda", notes: "Pune client visit", receipt_url: null },
  { id: 3, date: "2026-06-09", description: "Inbound budget allocation", category: "Miscellaneous", type: "income", amount: 5000.00, created_by: "Rohan Hudda", notes: "Approved by Finance Dept", receipt_url: null }
]);
let billingCustomerInfo = getOrSetLocal('huddo_billing_customer_info', []);

// Backup the original window.fetch
const originalFetch = window.fetch;

// Custom Mock Fetch Interceptor
window.fetch = async function (input, init) {
  let url = typeof input === 'string' ? input : input.url;
  
  if (!url.startsWith('/api/')) {
    return originalFetch.apply(this, arguments);
  }

  // Parse HTTP method
  const method = (init && init.method || 'GET').toUpperCase();
  const body = init && init.body ? JSON.parse(init.body) : null;
  
  // Query parameters parsing
  const urlObj = new URL(url, window.location.origin);
  const params = Object.fromEntries(urlObj.searchParams.entries());
  const pathname = urlObj.pathname;

  console.log(`[Mock API Interceptor] ${method} ${pathname}`, { params, body });

  // Simulate networking delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // 1. GET /api/hierarchy/state/:id/revenue
  const stateRevenueMatch = pathname.match(/^\/api\/hierarchy\/state\/([^/]+)\/revenue$/);
  if (stateRevenueMatch && method === 'GET') {
    const stateId = stateRevenueMatch[1];
    const stateNode = GEOGRAPHY.states.find(s => s.id === stateId);
    if (!stateNode) {
      return new Response(JSON.stringify({ error: "State not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Sum of confirmed billing/order revenue for retailers under that state
    // Mapped via retailers belonging to stateName
    const stateRetailers = retailers.filter(r => r.state.toLowerCase() === stateNode.name.toLowerCase());
    const stateRetailerNames = stateRetailers.map(r => r.shopName.toLowerCase());
    
    const confirmedOrders = orders.filter(o => 
      stateRetailerNames.includes(o.retailerName.toLowerCase()) && 
      ['delivered', 'shipped', 'approved', 'processing'].includes(o.status.toLowerCase())
    );
    
    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.amount, 0);
    return new Response(JSON.stringify({ state: stateNode.name, revenue: totalRevenue }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 2. GET /api/hierarchy/city/:id/revenue
  const cityRevenueMatch = pathname.match(/^\/api\/hierarchy\/city\/([^/]+)\/revenue$/);
  if (cityRevenueMatch && method === 'GET') {
    const cityId = cityRevenueMatch[1];
    const cityNode = GEOGRAPHY.cities.find(c => c.id === cityId);
    if (!cityNode) {
      return new Response(JSON.stringify({ error: "City not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    
    const cityRetailers = retailers.filter(r => r.city.toLowerCase() === cityNode.name.toLowerCase());
    const cityRetailerNames = cityRetailers.map(r => r.shopName.toLowerCase());
    
    const confirmedOrders = orders.filter(o => 
      cityRetailerNames.includes(o.retailerName.toLowerCase()) && 
      ['delivered', 'shipped', 'approved', 'processing'].includes(o.status.toLowerCase())
    );
    
    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.amount, 0);
    return new Response(JSON.stringify({ city: cityNode.name, revenue: totalRevenue }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 3. POST /api/departments/create
  if (pathname === '/api/departments/create' && method === 'POST') {
    if (!body || !body.name) {
      return new Response(JSON.stringify({ error: "Department Name is required" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const newDept = {
      id: body.code || body.name.replace(/\s+/g, ''),
      name: body.name,
      head: body.manager_id || "Not Assigned",
      members: 0,
      teams: 0,
      icon: "Users",
      features: { "Attendance Tracking": true, "Performance Reviews": true }
    };
    
    departments = [...departments, newDept];
    localStorage.setItem('huddo_departments', JSON.stringify(departments));
    return new Response(JSON.stringify(newDept), { status: 201, headers: { 'Content-Type': 'application/json' } });
  }

  // 4. POST /api/inventory/qr-in
  if (pathname === '/api/inventory/qr-in' && method === 'POST') {
    const { product_id, quantity } = body;
    if (!product_id || !quantity) {
      return new Response(JSON.stringify({ error: "Product ID and Quantity are required" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    inventory = inventory.map(item => {
      if (item.id === product_id) {
        const newLevel = item.stockLevel + Number(quantity);
        return {
          ...item,
          stockLevel: newLevel,
          status: newLevel <= item.reorderLevel ? (newLevel === 0 ? 'Out of Stock' : 'Low Stock') : 'Normal'
        };
      }
      return item;
    });
    localStorage.setItem('huddo_inventory', JSON.stringify(inventory));
    return new Response(JSON.stringify({ success: true, inventory }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 5. POST /api/inventory/qr-out
  if (pathname === '/api/inventory/qr-out' && method === 'POST') {
    const { product_id, quantity } = body;
    if (!product_id || !quantity) {
      return new Response(JSON.stringify({ error: "Product ID and Quantity are required" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const targetItem = inventory.find(item => item.id === product_id);
    if (!targetItem) {
      return new Response(JSON.stringify({ error: "Product not found in stock ledger" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (targetItem.stockLevel < Number(quantity)) {
      return new Response(JSON.stringify({ error: `Insufficient stock! Current stock: ${targetItem.stockLevel}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    inventory = inventory.map(item => {
      if (item.id === product_id) {
        const newLevel = item.stockLevel - Number(quantity);
        return {
          ...item,
          stockLevel: newLevel,
          status: newLevel <= item.reorderLevel ? (newLevel === 0 ? 'Out of Stock' : 'Low Stock') : 'Normal'
        };
      }
      return item;
    });
    localStorage.setItem('huddo_inventory', JSON.stringify(inventory));
    return new Response(JSON.stringify({ success: true, inventory }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 6. GET /api/promoters/:id/revenue-billings
  const promoterRevenueMatch = pathname.match(/^\/api\/promoters\/([^/]+)\/revenue-billings$/);
  if (promoterRevenueMatch && method === 'GET') {
    const promoterId = promoterRevenueMatch[1];
    // Find promoter's retailers
    const mappedRetailerNames = retailers
      .filter(r => r.promoter && r.promoter.toLowerCase() === promoterId.toLowerCase())
      .map(r => r.shopName.toLowerCase());
      
    // Find billings linked to these retailers
    const matchedInvoices = invoices.filter(inv => mappedRetailerNames.includes(inv.shopName.toLowerCase()));
    
    // Enrich with city details
    const enrichedInvoices = matchedInvoices.map(inv => {
      const retailerNode = retailers.find(r => r.shopName.toLowerCase() === inv.shopName.toLowerCase());
      return {
        ...inv,
        city: retailerNode ? retailerNode.city : "Unknown"
      };
    });
    
    return new Response(JSON.stringify(enrichedInvoices), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 7. PATCH /api/billing/:id/get-percentage
  const billingPercentMatch = pathname.match(/^\/api\/billing\/([^/]+)\/get-percentage$/);
  if (billingPercentMatch && method === 'PATCH') {
    const invoiceId = billingPercentMatch[1];
    const { percentage } = body;
    
    invoices = invoices.map(inv => {
      if (inv.id === invoiceId) {
        const newTax = Math.round(inv.amount * (Number(percentage) / 100));
        const newTotal = inv.amount + newTax;
        return {
          ...inv,
          overridePercentage: Number(percentage),
          tax: newTax,
          total: newTotal
        };
      }
      return inv;
    });
    localStorage.setItem('huddo_invoices', JSON.stringify(invoices));
    
    const updatedInvoice = invoices.find(inv => inv.id === invoiceId);
    return new Response(JSON.stringify(updatedInvoice), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 8. GET /api/inventory/return-stock
  if (pathname === '/api/inventory/return-stock' && method === 'GET') {
    return new Response(JSON.stringify(returnLogs), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 8. POST /api/inventory/return-stock
  if (pathname === '/api/inventory/return-stock' && method === 'POST') {
    const { product_id, quantity, reason, reference_no, notes, returned_by } = body;
    if (!product_id || !quantity) {
      return new Response(JSON.stringify({ error: "Product and Quantity are required" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const targetItem = inventory.find(item => item.id === product_id);
    if (!targetItem) {
      return new Response(JSON.stringify({ error: "Product variant not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Update stock Level
    inventory = inventory.map(item => {
      if (item.id === product_id) {
        const newLevel = item.stockLevel + Number(quantity);
        return {
          ...item,
          stockLevel: newLevel,
          status: newLevel <= item.reorderLevel ? (newLevel === 0 ? 'Out of Stock' : 'Low Stock') : 'Normal'
        };
      }
      return item;
    });
    localStorage.setItem('huddo_inventory', JSON.stringify(inventory));

    // Log the return
    const newLog = {
      id: `RET-LOG-${returnLogs.length + 1001}`,
      product_id,
      productName: targetItem.name,
      sku: targetItem.sku,
      quantity: Number(quantity),
      reason,
      reference_no: reference_no || "N/A",
      notes: notes || "",
      returned_by: returned_by || "Rohan Hudda",
      created_at: new Date().toISOString()
    };
    returnLogs = [newLog, ...returnLogs];
    localStorage.setItem('huddo_return_logs', JSON.stringify(returnLogs));

    return new Response(JSON.stringify({ success: true, log: newLog }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  }

  // 9. GET /api/customers
  if (pathname === '/api/customers' && method === 'GET') {
    // Generate Customer database dynamically from billing invoices
    // Retailers mapping holds details for retailers, let's also seed some end-consumers from billing_customer_info
    const customerDb = [...billingCustomerInfo];
    
    // Filter and search
    let results = customerDb;
    if (params.search) {
      const query = params.search.toLowerCase();
      results = results.filter(c => 
        c.customer_name.toLowerCase().includes(query) || 
        c.mobile.includes(query)
      );
    }
    if (params.city && params.city !== 'All') {
      results = results.filter(c => c.city.toLowerCase() === params.city.toLowerCase());
    }

    return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 10. GET /api/customers/:id
  const customerDetailMatch = pathname.match(/^\/api\/customers\/([^/]+)$/);
  if (customerDetailMatch && method === 'GET') {
    const customerId = customerDetailMatch[1];
    const customer = billingCustomerInfo.find(c => c.id === customerId);
    if (!customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Get order history from invoices/billing customer mappings
    const history = invoices.filter(inv => inv.customer_mobile === customer.mobile);
    return new Response(JSON.stringify({ customer, history }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 11. GET /api/petty-cash
  if (pathname === '/api/petty-cash' && method === 'GET') {
    let list = [...pettyCash];
    if (params.type && params.type !== 'All') {
      list = list.filter(item => item.type === params.type.toLowerCase());
    }
    if (params.category && params.category !== 'All') {
      list = list.filter(item => item.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.startDate && params.endDate) {
      list = list.filter(item => item.date >= params.startDate && item.date <= params.endDate);
    }
    return new Response(JSON.stringify(list), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 12. GET /api/petty-cash/summary
  if (pathname === '/api/petty-cash/summary' && method === 'GET') {
    let list = [...pettyCash];
    if (params.startDate && params.endDate) {
      list = list.filter(item => item.date >= params.startDate && item.date <= params.endDate);
    }
    
    const totalIn = list.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const totalOut = list.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const netBalance = totalIn - totalOut;

    return new Response(JSON.stringify({ totalIn, totalOut, netBalance }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 13. POST /api/petty-cash/add
  if (pathname === '/api/petty-cash/add' && method === 'POST') {
    const { date, description, amount, type, category, notes, receipt } = body;
    if (!description || !amount || !type || !category) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const newEntry = {
      id: pettyCash.length + 1,
      date: date || new Date().toISOString().split('T')[0],
      description,
      amount: Number(amount),
      type,
      category,
      notes: notes || "",
      created_by: "Rohan Hudda",
      receipt_url: receipt || null,
      created_at: new Date().toISOString()
    };

    pettyCash = [newEntry, ...pettyCash];
    localStorage.setItem('huddo_petty_cash', JSON.stringify(pettyCash));
    return new Response(JSON.stringify(newEntry), { status: 201, headers: { 'Content-Type': 'application/json' } });
  }

  // 14. POST /api/billing/retailer/customer-info (Internal helper to link customer during invoice generation)
  if (pathname === '/api/billing/retailer/customer-info' && method === 'POST') {
    const { invoice_id, customer_name, mobile, email, city, amount } = body;
    
    const customerRecord = {
      id: `CUST-${billingCustomerInfo.length + 101}`,
      customer_name,
      mobile,
      email: email || "N/A",
      city,
      totalOrders: 1,
      totalSpend: Number(amount),
      lastOrderDate: new Date().toISOString().split('T')[0]
    };
    
    // Check if customer already exists by mobile
    const existingIdx = billingCustomerInfo.findIndex(c => c.mobile === mobile);
    if (existingIdx > -1) {
      const existing = billingCustomerInfo[existingIdx];
      billingCustomerInfo[existingIdx] = {
        ...existing,
        totalOrders: existing.totalOrders + 1,
        totalSpend: existing.totalSpend + Number(amount),
        lastOrderDate: new Date().toISOString().split('T')[0]
      };
    } else {
      billingCustomerInfo = [...billingCustomerInfo, customerRecord];
    }
    
    localStorage.setItem('huddo_billing_customer_info', JSON.stringify(billingCustomerInfo));
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Fallback to normal fetch
  return originalFetch.apply(this, arguments);
};
