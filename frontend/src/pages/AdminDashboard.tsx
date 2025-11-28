import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

export function AdminDashboard() {
  const { dark } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${dark ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto`}>
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Admin Dashboard</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Revenue</p>
                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>
                  ${stats?.total_revenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              +{stats?.revenue_growth || 0}% from last month
            </p>
          </div>

          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Orders</p>
                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{stats?.total_orders || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              {stats?.orders_today || 0} orders today
            </p>
          </div>

          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Products</p>
                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{stats?.total_products || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-2">
              {stats?.active_products || 0} active
            </p>
          </div>

          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Avg Order Value</p>
                <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>
                  ${stats?.avg_order_value?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#FF9D6F]" />
              </div>
            </div>
            <p className="text-xs text-[#FF9D6F] mt-2">
              +{stats?.aov_growth || 0}% from last month
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Sales Trend (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.sales_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={dark ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={dark ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: dark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
                    color: dark ? '#ffffff' : '#000000'
                  }}
                />
                <Line type="monotone" dataKey="sales" stroke="#FF9D6F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Top Products</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.top_products || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={dark ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={dark ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: dark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
                    color: dark ? '#ffffff' : '#000000'
                  }}
                />
                <Bar dataKey="sales" fill="#FF9D6F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
          <div className={`px-6 py-4 border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                    Order ID
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                    Customer
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                    Date
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                    Total
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {stats?.recent_orders?.map((order: any) => (
                  <tr key={order.id}>
                    <td className={`px-6 py-4 text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>#{order.id}</td>
                    <td className={`px-6 py-4 text-sm ${dark ? 'text-gray-300' : 'text-gray-900'}`}>{order.customer_name}</td>
                    <td className={`px-6 py-4 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#FF9D6F]">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
