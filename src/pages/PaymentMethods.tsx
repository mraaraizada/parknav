import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Trash2, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  name: string;
  details: string;
  isDefault: boolean;
}

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', name: 'Visa', details: '•••• 4321', isDefault: true },
    { id: '2', type: 'upi', name: 'UPI', details: 'rahul@paytm', isDefault: false },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: 'card' as const, name: '', details: '' });

  const addMethod = () => {
    if (newMethod.name && newMethod.details) {
      setMethods([...methods, { ...newMethod, id: Date.now().toString(), isDefault: false }]);
      setNewMethod({ type: 'card', name: '', details: '' });
      setShowAddModal(false);
    }
  };

  const setDefault = (id: string) => {
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const deleteMethod = (id: string) => {
    setMethods(methods.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
              <CreditCard size={16} color="white" />
            </div>
            <h1 className="font-bold text-slate-800 text-lg">Payment Methods</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Payment methods list */}
      <div className="px-4 py-4 space-y-3">
        {methods.map((method, i) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
              method.isDefault ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CreditCard size={22} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{method.name}</h3>
                  {method.isDefault && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{method.details}</p>
                <div className="flex gap-2 mt-3">
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefault(method.id)}
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteMethod(method.id)}
                className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">Add Payment Method</h2>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Payment Type</label>
                  <select
                    value={newMethod.type}
                    onChange={e => setNewMethod({ ...newMethod, type: e.target.value as 'card' | 'upi' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    {newMethod.type === 'card' ? 'Card Name' : 'UPI Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={newMethod.type === 'card' ? 'e.g., Visa' : 'e.g., PhonePe'}
                    value={newMethod.name}
                    onChange={e => setNewMethod({ ...newMethod, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    {newMethod.type === 'card' ? 'Card Number' : 'UPI ID'}
                  </label>
                  <input
                    type="text"
                    placeholder={newMethod.type === 'card' ? '•••• 1234' : 'username@upi'}
                    value={newMethod.details}
                    onChange={e => setNewMethod({ ...newMethod, details: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <button
                onClick={addMethod}
                className="w-full mt-6 py-3.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
              >
                Add Payment Method
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
