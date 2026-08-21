'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import { InvoiceDTO, InvoiceItemDTO, PaymentTerm } from '@/lib/accounting/invoicing-service';
import { EntityDirectoryEngine, ClientEntity } from '@/lib/directory/entity-directory-engine';
import { US_STATES_LIST } from '@/lib/company/company-profile-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, Plus, Trash2, Receipt, Building2, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: InvoiceDTO) => void;
  clients?: ClientEntity[];
}

export function NewInvoiceModal({
  isOpen,
  onClose,
  onInvoiceCreated,
  clients = EntityDirectoryEngine.INITIAL_CLIENTS,
}: NewInvoiceModalProps) {
  const { locale, t } = useI18n();

  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'cnt-acme');
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>('NET_30');

  const [items, setItems] = useState<InvoiceItemDTO[]>([
    {
      description: 'Serviços de Manutenção e Engenharia de Software Especializada',
      quantity: 40,
      unitPrice: 150,
      pricingModel: 'HOURLY',
      revenueAccountCode: '4010',
    },
  ]);

  if (!isOpen) return null;

  // Calculate tax based on client's state
  const stateMeta = US_STATES_LIST.find((s) => s.code === (selectedClient?.stateCode || 'TX'));
  const salesTaxRate = selectedClient?.isTaxExempt ? 0 : stateMeta?.defaultSalesTaxRate || 0.0825;

  const subtotal = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice || 0), 0);
  const taxAmount = subtotal * salesTaxRate;
  const totalAmount = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: 'Serviços Técnicos e Operacionais Adicionais',
        quantity: 1,
        unitPrice: 250,
        pricingModel: 'FIXED_FEE' as const,
        revenueAccountCode: '4010',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: InvoiceDTO = {
      id: `inv-${Date.now()}`,
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: selectedClient.id,
      contactName: selectedClient.name,
      invoiceNumber: invoiceNum,
      issueDate,
      dueDate,
      paymentTerm,
      items,
      subtotal,
      taxAmount,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      status: 'ISSUED',
      paymentLinkUrl: `https://pay.mistercontabil.com/inv/${invoiceNum}`,
    };

    onInvoiceCreated(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Emitir Nova Fatura de Serviços (Service Invoice)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Client Selection & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Cliente Cadastrado:</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium focus:border-emerald-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stateCode})
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-slate-500 mt-1">
                Endereço: {selectedClient?.billingAddress}, {selectedClient?.city} - {selectedClient?.stateCode}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Data de Emissão:</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Condição:</label>
                <select
                  value={paymentTerm}
                  onChange={(e) => setPaymentTerm(e.target.value as any)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                >
                  <option value="DUE_ON_RECEIPT">Due on Receipt</option>
                  <option value="NET_15">NET 15</option>
                  <option value="NET_30">NET 30</option>
                  <option value="NET_60">NET 60</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">Itens da Fatura</span>
              <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={handleAddItem}>
                <Plus className="w-3 h-3 mr-1" /> Adicionar Linha
              </Button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Descrição do serviço executado..."
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="flex-1 h-8 rounded bg-slate-950 border border-slate-800 px-2 text-white font-medium"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Quantidade / Horas:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 1)}
                      className="w-full h-8 rounded bg-slate-950 border border-slate-800 px-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Preço Unitário (\$):</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full h-8 rounded bg-slate-950 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Subtotal do Item:</label>
                    <div className="h-8 rounded bg-slate-950 border border-slate-800 px-2 flex items-center justify-end font-mono font-bold text-white">
                      {formatCurrency(item.quantity * item.unitPrice, 'USD', locale)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal dos Serviços:</span>
              <span>{formatCurrency(subtotal, 'USD', locale)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Sales Tax ({selectedClient?.stateCode} {(salesTaxRate * 100).toFixed(2)}%):</span>
              <span>{formatCurrency(taxAmount, 'USD', locale)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-emerald-400 pt-2 border-t border-slate-800">
              <span className="text-white uppercase">Total a Faturar (Balance Due):</span>
              <span>{formatCurrency(totalAmount, 'USD', locale)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
              Emitir Fatura & Gerar Link de Pagamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
