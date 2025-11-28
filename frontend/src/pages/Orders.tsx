import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Search, Eye, Printer } from 'lucide-react';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import api from '../utils/api';

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = orders.filter(
        (order) =>
          (order.user?.name && order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          order.id.toString().includes(searchQuery)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      // Handle Laravel pagination response
      const ordersData = response.data.data?.data || response.data.data || response.data || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (order: any) => {
    const itemsRows = order.items
      .map(
        (it: any) => `
          <tr>
            <td style="padding:6px 0;">${it.product_name}${it.size ? ` (${it.size})` : ''}$${it.temperature ? `, ${it.temperature}` : ''}</td>
            <td style="padding:6px 0; text-align:center;">${it.quantity}</td>
            <td style="padding:6px 0; text-align:right;">$${Number(it.total_price).toFixed(2)}</td>
          </tr>
        `
      )
      .join('');

    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice #${order.order_number || order.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 24px; color: #111827; }
          .card { max-width: 720px; margin: 0 auto; }
          .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
          .brand { display:flex; align-items:center; gap:12px; }
          .brand img { width:48px; height:48px; border-radius:9999px; object-fit:contain; background:rgba(255,255,255,0.12); }
          .muted { color:#6B7280; }
          table { width:100%; border-collapse:collapse; margin-top:12px; }
          th { text-align:left; color:#6B7280; font-size:12px; padding-bottom:8px; border-bottom:1px solid #E5E7EB; }
          td { font-size:14px; }
          tfoot td { border-top:1px solid #E5E7EB; padding-top:8px; font-weight:600; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="brand">
              <img src="/mynewlogo.png" alt="Logo" />
              <div>
                <div style="font-weight:700;">Heen Coffee</div>
                <div class="muted">Chom Chao Center</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700;">Invoice</div>
              <div class="muted">${new Date(order.created_at).toLocaleString()}</div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div class="muted" style="font-size:12px;">Order #</div>
              <div style="font-weight:600;">${order.order_number || `ORD-${order.id}`}</div>
            </div>
            <div>
              <div class="muted" style="font-size:12px; text-align:right;">Cashier</div>
              <div style="font-weight:600; text-align:right;">${order.user?.name || 'Guest'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td style="text-align:right;">Subtotal</td>
                <td style="text-align:right;">$${Number(order.subtotal).toFixed(2)}</td>
              </tr>
              ${order.discount_amount && Number(order.discount_amount) > 0 ? `
              <tr>
                <td></td>
                <td style="text-align:right;">Discount</td>
                <td style="text-align:right;">-$${Number(order.discount_amount).toFixed(2)}</td>
              </tr>` : ''}
              <tr>
                <td></td>
                <td style="text-align:right;">Total</td>
                <td style="text-align:right;">$${Number(order.total).toFixed(2)}</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align:right;">Payment</td>
                <td style="text-align:right;">${order.payment_method}</td>
              </tr>
            </tfoot>
          </table>

          <div class="muted" style="margin-top:16px; font-size:12px;">Thank you for your purchase!</div>
        </div>
        <script>
          window.onload = function() { window.print(); setTimeout(() => window.close(), 200); };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  const { dark } = useTheme();

  return (
    <div className={`h-screen flex flex-col ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className={`${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <h1 className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Orders</h1>
      </div>

      <div className={`p-6 ${dark ? 'text-gray-200' : ''}`}>
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent transition-colors ${dark ? 'bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500' : 'border-gray-300'}`}
          />
        </div>

        {loading ? (
          <div className={`text-center py-12 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className={`text-center py-12 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>No orders found</div>
        ) : (
          <div className={`${dark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <table className="w-full">
              <thead className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Order ID
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Customer
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Date
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Items
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? 'divide-gray-800' : 'divide-gray-200'}`}>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 text-sm font-medium ${dark ? 'text-gray-200' : ''}`}>#{order.id}</td>
                    <td className={`px-6 py-4 text-sm ${dark ? 'text-gray-200' : ''}`}>{order.user?.name || 'Guest'}</td>
                    <td className={`px-6 py-4 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4 text-sm ${dark ? 'text-gray-200' : ''}`}>{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#FF9D6F]">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[#FF9D6F] hover:text-[#FF7B47] flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handlePrint(order)}
                          className="text-[#FF9D6F] hover:text-[#FF7B47] flex items-center space-x-1"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
