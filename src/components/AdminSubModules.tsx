import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Edit3,
  Eye,
  EyeOff,
  AlertTriangle,
  Search,
  Shield,
  KeyRound,
  UserPlus,
  ShoppingBag,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Star,
  Tag,
  PackageCheck,
  PackageX,
  Percent,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp, InquiryRecord, BookingRecord } from '../context/AppContext';
import { GalleryImageItem, ReviewItem, BlogPostItem, VISUAL_ASSETS } from '../data/initialData';
import {
  DryFruitProduct,
  EMPTY_DRY_FRUIT_TEMPLATE,
  SAMPLE_DRY_FRUIT_IMAGES,
  DRY_FRUITS_CATEGORIES,
} from '../data/dryFruitsData';

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<{
  state: ConfirmDialogState;
  onClose: () => void;
}> = ({ state, onClose }) => {
  if (!state.open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-slate-900">ARE YOU SURE?</h3>
            <p className="text-xs text-slate-600 font-medium">
              This action cannot be easily undone.
            </p>
            <p className="text-xs text-slate-800 font-semibold pt-1">{state.message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={() => {
              state.onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            {state.confirmLabel || 'DELETE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminBookingsSection: React.FC<{
  notify: (msg: string) => void;
  askConfirm: (message: string, onConfirm: () => void, confirmLabel?: string) => void;
}> = ({ notify, askConfirm }) => {
  const { bookings, allTours, createBookingAdmin, updateBookingAdmin, deleteBookingAdmin } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tourTitle, setTourTitle] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [bookingStatus, setBookingStatus] = useState<BookingRecord['bookingStatus']>('CONFIRMED');
  const [paymentStatus, setPaymentStatus] = useState<BookingRecord['paymentStatus']>('PAYMENT PENDING');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setEditingId('');
    setCustomerName('');
    setEmail('');
    setWhatsapp('');
    setTourTitle(allTours[0]?.title || 'Hunza Valley Discovery');
    setTravelDates('');
    setTravelers(2);
    setBookingStatus('CONFIRMED');
    setPaymentStatus('PAYMENT PENDING');
    setNotes('');
    setShowForm(false);
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !tourTitle.trim()) return;
    if (editingId) {
      await updateBookingAdmin(editingId, bookingStatus, paymentStatus, travelDates, notes, {
        customerName: customerName.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        tourTitle: tourTitle.trim(),
        travelers: Math.max(1, Number(travelers) || 1),
      });
      notify(`Updated booking ${editingId}.`);
    } else {
      const matchedTour = allTours.find((t) => t.title === tourTitle);
      const created = await createBookingAdmin({
        customerName: customerName.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        tourId: matchedTour?.id || tourTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tourTitle: tourTitle.trim(),
        travelDates: travelDates.trim() || 'Flexible',
        travelers: Math.max(1, Number(travelers) || 1),
        bookingStatus,
        paymentStatus,
        notes: notes.trim(),
      });
      notify(`Created booking ${created.id} for ${created.customerName}.`);
    }
    resetForm();
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search.trim() ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.tourTitle.toLowerCase().includes(search.toLowerCase()) ||
      (b.email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'ALL' ||
      b.bookingStatus.toUpperCase() === statusFilter ||
      b.paymentStatus.toUpperCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Booking Management ({bookings.length})
          </h2>
          <p className="text-xs text-slate-600">
            Create, edit, update status, and manage all customer bookings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, customer, tour..."
              className="pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900 font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="UNDER REVIEW">UNDER REVIEW</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PAYMENT PENDING">PAYMENT PENDING</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setTourTitle(allTours[0]?.title || 'Hunza Valley Discovery');
                setShowForm(true);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showForm ? 'Close Form' : 'Add Booking'}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSaveBooking}
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-base font-bold text-slate-900">
              {editingId ? `Edit Booking (${editingId})` : 'Create New Booking Record'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Phone *
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tour Package *
              </label>
              <input
                type="text"
                required
                list="admin-tour-titles"
                value={tourTitle}
                onChange={(e) => setTourTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <datalist id="admin-tour-titles">
                {allTours.map((t) => (
                  <option key={t.id} value={t.title} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Travel Dates
              </label>
              <input
                type="text"
                value={travelDates}
                onChange={(e) => setTravelDates(e.target.value)}
                placeholder="e.g. June 15 - June 20"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Travelers
              </label>
              <input
                type="number"
                min={1}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Status
              </label>
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value as BookingRecord['bookingStatus'])}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
              >
                <option value="PENDING">PENDING</option>
                <option value="UNDER REVIEW">UNDER REVIEW</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PAYMENT PENDING">PAYMENT PENDING</option>
                <option value="PAID">PAID</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as BookingRecord['paymentStatus'])}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
              >
                <option value="PAYMENT PENDING">PAYMENT PENDING</option>
                <option value="UNDER REVIEW">UNDER REVIEW</option>
                <option value="PAID">PAID</option>
                <option value="UNPAID">UNPAID</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requests or admin notes..."
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
          >
            {editingId ? 'Save Booking Changes' : 'Create Booking'}
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-600">
          0 booking records found.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="p-3.5">Booking ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Tour &amp; Travel Date</th>
                <th className="p-3.5">Travelers</th>
                <th className="p-3.5">Booking Status</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5">Created Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((bk) => (
                <tr key={bk.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5 font-mono-num font-semibold text-slate-900">{bk.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{bk.customerName}</div>
                    <div className="text-slate-500">{bk.email}</div>
                    <div className="text-emerald-700 font-mono-num">{bk.whatsapp}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{bk.tourTitle}</div>
                    <div className="text-slate-600">Date: {bk.travelDates || 'Flexible'}</div>
                    {bk.notes && (
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                        Note: {bk.notes}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 font-mono-num font-bold text-slate-900">{bk.travelers}</td>
                  <td className="p-3.5">
                    <select
                      value={bk.bookingStatus}
                      onChange={async (e) => {
                        await updateBookingAdmin(
                          bk.id,
                          e.target.value as BookingRecord['bookingStatus'],
                          bk.paymentStatus,
                          bk.travelDates,
                          bk.notes
                        );
                        notify(`Booking ${bk.id} status updated to ${e.target.value}.`);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="UNDER REVIEW">UNDER REVIEW</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PAYMENT PENDING">PAYMENT PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={bk.paymentStatus}
                      onChange={async (e) => {
                        await updateBookingAdmin(
                          bk.id,
                          bk.bookingStatus,
                          e.target.value as BookingRecord['paymentStatus'],
                          bk.travelDates,
                          bk.notes
                        );
                        notify(`Booking ${bk.id} payment status updated to ${e.target.value}.`);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="PAYMENT PENDING">PAYMENT PENDING</option>
                      <option value="UNDER REVIEW">UNDER REVIEW</option>
                      <option value="PAID">PAID</option>
                      <option value="UNPAID">UNPAID</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-slate-600 font-mono-num">
                    {bk.createdAt ? new Date(bk.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(bk.id);
                        setCustomerName(bk.customerName);
                        setEmail(bk.email);
                        setWhatsapp(bk.whatsapp);
                        setTourTitle(bk.tourTitle);
                        setTravelDates(bk.travelDates);
                        setTravelers(bk.travelers);
                        setBookingStatus(bk.bookingStatus);
                        setPaymentStatus(bk.paymentStatus);
                        setNotes(bk.notes || '');
                        setShowForm(true);
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        askConfirm(
                          `Delete booking ${bk.id} for ${bk.customerName}?`,
                          async () => {
                            await deleteBookingAdmin(bk.id);
                            notify(`Deleted booking ${bk.id}.`);
                          }
                        )
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const AdminInquiriesSection: React.FC<{
  notify: (msg: string) => void;
  askConfirm: (message: string, onConfirm: () => void, confirmLabel?: string) => void;
}> = ({ notify, askConfirm }) => {
  const { inquiries, updateInquiryAdmin, deleteInquiryAdmin } = useApp();
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = inquiries.filter((inq) => {
    const matchSearch =
      !search.trim() ||
      inq.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      (inq.destination || '').toLowerCase().includes(search.toLowerCase()) ||
      (inq.message || '').toLowerCase().includes(search.toLowerCase());
    const normStatus = inq.status.toUpperCase() === 'PENDING' ? 'NEW' : inq.status.toUpperCase();
    const matchStatus = statusFilter === 'ALL' || normStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Customer Inquiries ({inquiries.length})
          </h2>
          <p className="text-xs text-slate-600">
            Manage inquiry statuses and private admin internal notes (never visible to customers).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, destination..."
              className="pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-600">
          0 customer inquiries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((inq) => {
            const currentNote =
              notesDraft[inq.id] !== undefined ? notesDraft[inq.id] : inq.internalNotes || '';
            return (
              <div
                key={inq.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{inq.customerName}</div>
                    <div className="text-xs text-slate-600">
                      {inq.email} · WhatsApp:{' '}
                      <span className="font-mono-num font-semibold text-emerald-700">
                        {inq.whatsapp}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono-num mt-0.5">
                      Date: {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status.toUpperCase() === 'PENDING' ? 'NEW' : inq.status}
                      onChange={async (e) => {
                        await updateInquiryAdmin(
                          inq.id,
                          e.target.value as InquiryRecord['status'],
                          currentNote
                        );
                        notify(`Inquiry status changed to ${e.target.value}.`);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        askConfirm(`Delete inquiry from ${inq.customerName}?`, async () => {
                          await deleteInquiryAdmin(inq.id);
                          notify('Inquiry deleted.');
                        })
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-500 block">Destination / Tour</span>
                    <span className="font-semibold text-slate-900">
                      {inq.destination || inq.tourSlug || 'General'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Travel Dates</span>
                    <span className="font-semibold text-slate-900">
                      {inq.preferredDates || 'Flexible'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Travelers</span>
                    <span className="font-mono-num font-semibold text-slate-900">
                      {inq.travelers}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-slate-100">
                  {inq.message}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Admin Internal Notes (Private — Hidden from Customer)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentNote}
                      onChange={(e) =>
                        setNotesDraft((prev) => ({ ...prev, [inq.id]: e.target.value }))
                      }
                      placeholder="Add internal follow-up notes..."
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        await updateInquiryAdmin(inq.id, inq.status, currentNote);
                        notify('Internal note saved.');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const AdminCustomersSection: React.FC<{
  notify: (msg: string) => void;
  askConfirm: (message: string, onConfirm: () => void, confirmLabel?: string) => void;
}> = ({ notify, askConfirm }) => {
  const { allUsers, saveCustomerAdmin, updateCustomerStatusAdmin, deleteCustomerAdmin } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingUid, setEditingUid] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'disabled'>('active');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setEditingUid('');
    setDisplayName('');
    setEmail('');
    setPhone('');
    setStatus('active');
    setPassword('');
    setShowForm(false);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveCustomerAdmin({
      uid: editingUid || undefined,
      displayName,
      email,
      phone,
      status,
      password: password.trim() || undefined,
    });
    if (res.success) {
      notify(editingUid ? `Updated customer ${email}.` : `Registered customer ${email}.`);
      resetForm();
    } else {
      notify(res.error || 'Could not save customer.');
    }
  };

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      !search.trim() ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'ALL' || (u.status || 'active') === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Registered Customers ({allUsers.length})
          </h2>
          <p className="text-xs text-slate-600">
            Manage customer registrations, contact details, and account enable/disable status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone..."
              className="pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
          >
            <option value="ALL">All Accounts</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
          <button
            type="button"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showForm ? 'Close Form' : 'Add Customer'}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSaveCustomer}
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-base font-bold text-slate-900">
              {editingUid ? `Edit Customer Account (${email})` : 'Register New Customer Account'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {editingUid ? 'Set New Password (optional, min 6 chars)' : 'Initial Password (min 6 chars) *'}
              </label>
              <input
                type="password"
                required={!editingUid}
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editingUid ? 'Leave blank to keep existing password' : 'Enter customer password'}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'disabled')}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
          >
            {editingUid ? 'Save Customer Changes' : 'Register Customer'}
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-600">
          0 registered customers found.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Registration Date</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-50/80">
                  <td className="p-3.5 font-bold text-slate-900">{u.displayName}</td>
                  <td className="p-3.5 text-slate-700">{u.email}</td>
                  <td className="p-3.5 font-mono-num text-slate-700">{u.phone || '—'}</td>
                  <td className="p-3.5 font-mono-num text-slate-600">CUSTOMER</td>
                  <td className="p-3.5 font-mono-num text-slate-600">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={u.status || 'active'}
                      onChange={async (e) => {
                        await updateCustomerStatusAdmin(
                          u.uid,
                          e.target.value as 'active' | 'disabled'
                        );
                        notify(`Customer ${u.email} status set to ${e.target.value}.`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUid(u.uid);
                        setDisplayName(u.displayName);
                        setEmail(u.email || '');
                        setPhone(u.phone || '');
                        setStatus((u.status as 'active' | 'disabled') || 'active');
                        setPassword('');
                        setShowForm(true);
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        askConfirm(`Delete customer account "${u.email}"?`, async () => {
                          await deleteCustomerAdmin(u.uid);
                          notify(`Deleted customer ${u.email}.`);
                        })
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl inline-flex items-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const AdminGallerySection: React.FC<{
  notify: (msg: string) => void;
  askConfirm: (message: string, onConfirm: () => void, confirmLabel?: string) => void;
}> = ({ notify, askConfirm }) => {
  const {
    allGallery,
    saveGalleryImageAdmin,
    deleteGalleryImageAdmin,
    togglePublishGalleryAdmin,
  } = useApp();

  const [editingId, setEditingId] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(VISUAL_ASSETS.heroKarakoram);
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('Hunza');
  const [destination, setDestination] = useState('Hunza');
  const [published, setPublished] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !imageUrl.trim()) return;
    await saveGalleryImageAdmin({
      id: editingId || `gal_${Date.now()}`,
      imageUrl,
      caption: caption.trim(),
      altText: altText.trim() || caption.trim(),
      category,
      destination,
      published,
    });
    notify(editingId ? 'Gallery image updated.' : 'Gallery image uploaded.');
    setEditingId('');
    setCaption('');
    setAltText('');
    setPublished(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {editingId ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId('');
                setCaption('');
                setAltText('');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Image URL or File *</label>
            <label className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-semibold cursor-pointer">
              Upload File
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <input
            type="text"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-36 object-cover rounded-xl border border-slate-200"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Caption *</label>
          <input
            type="text"
            required
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Autumn foliage in Karimabad, Hunza"
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Alt Text</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Descriptive alt text for accessibility"
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            >
              <option value="Hunza">Hunza</option>
              <option value="Skardu">Skardu</option>
              <option value="Mountains & Lakes">Mountains &amp; Lakes</option>
              <option value="Trekking">Trekking</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Published on public gallery</span>
        </label>

        <button
          type="submit"
          className="w-full py-2.5 px-4 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
        >
          {editingId ? 'Save Gallery Changes' : 'Add Photo to Gallery'}
        </button>
      </form>

      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allGallery.map((g: GalleryImageItem) => (
          <div
            key={g.id}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between gap-3 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <img
                src={g.imageUrl}
                alt={g.altText || g.caption}
                className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{g.caption}</div>
                <div className="text-[11px] text-slate-500">
                  {g.category} · {g.destination}
                </div>
                <div className="text-[11px] font-semibold mt-1 text-slate-600">
                  Status: {g.published === false ? 'Unpublished' : 'Published'}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(g.id);
                  setImageUrl(g.imageUrl);
                  setCaption(g.caption);
                  setAltText(g.altText);
                  setCategory(g.category);
                  setDestination(g.destination);
                  setPublished(g.published !== false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await togglePublishGalleryAdmin(g.id);
                  notify(
                    g.published === false ? 'Gallery photo published.' : 'Gallery photo unpublished.'
                  );
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1"
              >
                {g.published === false ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Unpublish</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  askConfirm(`Delete gallery image "${g.caption}"?`, async () => {
                    await deleteGalleryImageAdmin(g.id);
                    notify('Gallery image deleted.');
                  })
                }
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminReviewsSection: React.FC<{
  notify: (msg: string) => void;
  askConfirm: (message: string, onConfirm: () => void, confirmLabel?: string) => void;
}> = ({ notify, askConfirm }) => {
  const { allReviews, saveReviewAdmin, deleteReviewAdmin, togglePublishReviewAdmin } = useApp();
  const [editingId, setEditingId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [date, setDate] = useState('2026');
  const [reviewText, setReviewText] = useState('');
  const [published, setPublished] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) return;
    await saveReviewAdmin({
      id: editingId || `rev_${Date.now()}`,
      customerName: customerName.trim(),
      rating: Number(rating),
      date,
      dateText: date,
      reviewText: reviewText.trim(),
      verified: true,
      published,
    });
    notify(editingId ? 'Review updated.' : 'Review saved.');
    setEditingId('');
    setCustomerName('');
    setReviewText('');
    setPublished(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {editingId ? 'Edit Customer Review' : 'Add Verified Customer Review'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId('');
                setCustomerName('');
                setReviewText('');
              }}
              className="text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
          )}
        </div>
        <input
          type="text"
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name *"
          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (1-5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="2026"
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
          </div>
        </div>
        <textarea
          rows={4}
          required
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Authentic customer review..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
        />
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Published publicly</span>
        </label>
        <button
          type="submit"
          className="w-full py-2.5 px-4 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
        >
          {editingId ? 'Save Review Changes' : 'Save Review'}
        </button>
      </form>

      <div className="lg:col-span-7 space-y-3">
        {allReviews.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-600">
            0 reviews recorded. No fake reviews are generated.
          </div>
        ) : (
          allReviews.map((r: ReviewItem) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4 shadow-xs"
            >
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {r.customerName} · {r.rating}/5 Stars
                </div>
                <div className="text-[11px] text-slate-500">
                  {r.date || r.dateText || '2026'} ·{' '}
                  {r.published === false ? 'Unpublished' : 'Published'}
                </div>
                <p className="text-xs text-slate-700 mt-1.5">{r.reviewText}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(r.id);
                    setCustomerName(r.customerName);
                    setRating(r.rating);
                    setDate(r.date || r.dateText || '2026');
                    setReviewText(r.reviewText);
                    setPublished(r.published !== false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await togglePublishReviewAdmin(r.id);
                    notify(r.published === false ? 'Review published.' : 'Review unpublished.');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
                >
                  {r.published === false ? 'Publish' : 'Unpublish'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    askConfirm(`Delete review from ${r.customerName}?`, async () => {
                      await deleteReviewAdmin(r.id);
                      notify('Review deleted.');
                    })
                  }
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const AdminGuidesSection: React.FC<{
  notify: (msg: string) => void;
  askConfirm: (message: string, onConfirm: () => void, confirmLabel?: string) => void;
}> = ({ notify, askConfirm }) => {
  const {
    allBlogPosts,
    saveBlogPostAdmin,
    deleteBlogPostAdmin,
    togglePublishBlogPostAdmin,
  } = useApp();

  const [editingId, setEditingId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Travel Planning');
  const [readTime, setReadTime] = useState('6 min read');
  const [imageUrl, setImageUrl] = useState<string>(VISUAL_ASSETS.heroKarakoram);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [published, setPublished] = useState(true);
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setEditingId('');
    setTitle('');
    setSlug('');
    setCategory('Travel Planning');
    setReadTime('6 min read');
    setImageUrl(VISUAL_ASSETS.heroKarakoram);
    setExcerpt('');
    setContent('');
    setSeoTitle('');
    setSeoDescription('');
    setPublished(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const computedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    await saveBlogPostAdmin({
      id: editingId || computedSlug,
      slug: computedSlug,
      title: title.trim(),
      category: category.trim() || 'Travel Planning',
      readTime: readTime.trim() || '5 min read',
      imageUrl,
      excerpt: excerpt.trim() || content.trim().slice(0, 160),
      content: content.trim(),
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || excerpt.trim(),
      published,
    });
    notify(editingId ? `Travel guide "${title}" updated.` : `Travel guide "${title}" created.`);
    resetForm();
  };

  const filtered = allBlogPosts.filter(
    (p) =>
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {editingId ? 'Edit Travel Guide / Content' : 'Create Travel Guide / Content'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          )}
        </div>

        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article / Guide Title *"
          className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. Hunza Guide)"
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
          <input
            type="text"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="Read Time (e.g. 6 min read)"
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Cover Image</label>
            <label className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-semibold cursor-pointer">
              Upload Image
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>

        <textarea
          rows={2}
          required
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short Summary / Excerpt *"
          className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
        />

        <textarea
          rows={5}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Full Guide Content *"
          className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
        />

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Published publicly on Travel Guides</span>
        </label>

        <button
          type="submit"
          className="w-full py-2.5 px-4 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
        >
          {editingId ? 'Save Guide Changes' : 'Publish Travel Guide'}
        </button>
      </form>

      <div className="lg:col-span-7 space-y-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800">
            Travel Guides &amp; Content Articles ({allBlogPosts.length})
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter guides..."
            className="px-3 py-1.5 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>

        {filtered.map((post: BlogPostItem) => (
          <div
            key={post.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <img
                src={post.imageUrl || VISUAL_ASSETS.heroKarakoram}
                alt={post.title}
                className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div>
                <div className="text-xs font-semibold text-emerald-800">
                  {post.category} · {post.readTime} ·{' '}
                  {post.published === false ? 'Unpublished' : 'Published'}
                </div>
                <div className="text-sm font-bold text-slate-900">{post.title}</div>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{post.excerpt}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditingId(post.id);
                  setTitle(post.title);
                  setSlug(post.slug);
                  setCategory(post.category);
                  setReadTime(post.readTime);
                  setImageUrl(post.imageUrl);
                  setExcerpt(post.excerpt);
                  setContent(post.content);
                  setSeoTitle(post.seoTitle || '');
                  setSeoDescription(post.seoDescription || '');
                  setPublished(post.published !== false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={async () => {
                  await togglePublishBlogPostAdmin(post.id);
                  notify(
                    post.published === false
                      ? `Published "${post.title}".`
                      : `Unpublished "${post.title}".`
                  );
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
              >
                {post.published === false ? 'Publish' : 'Unpublish'}
              </button>
              <button
                type="button"
                onClick={() =>
                  askConfirm(`Delete travel guide "${post.title}"?`, async () => {
                    await deleteBlogPostAdmin(post.id);
                    notify(`Deleted travel guide "${post.title}".`);
                  })
                }
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminSettingsSection: React.FC<{ notify: (msg: string) => void }> = ({ notify }) => {
  const { business, saveSiteSettingsAdmin } = useApp();
  const [form, setForm] = useState({
    name: business.name,
    phone: business.phone,
    whatsapp: business.whatsapp,
    email: business.email,
    signupNotificationEmail: business.signupNotificationEmail,
    jazzcashNumber: business.jazzcashNumber,
    jazzcashName: business.jazzcashName,
    tagline: business.tagline,
    address: business.address || '',
    businessHours: business.businessHours || '',
    heroHeadline: business.heroHeadline,
    heroDescription: business.heroDescription,
    ctaText: business.ctaText || '',
    footerInfo: business.footerInfo || '',
    seoTitle: business.seoTitle || '',
    seoDescription: business.seoDescription || '',
    paymentInstructions: business.paymentInstructions,
    bookingPolicy: business.bookingPolicy,
    cancellationPolicy: business.cancellationPolicy,
    refundPolicy: business.refundPolicy || '',
    instagramHandle1: business.instagram?.[0]?.handle || '@only_baig',
    instagramUrl1: business.instagram?.[0]?.url || 'https://www.instagram.com/only_baig/',
    instagramHandle2: business.instagram?.[1]?.handle || '@baig_treks_and_tours',
    instagramUrl2:
      business.instagram?.[1]?.url || 'https://www.instagram.com/baig_treks_and_tours/',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSiteSettingsAdmin({
      name: form.name,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      signupNotificationEmail: form.signupNotificationEmail,
      jazzcashNumber: form.jazzcashNumber,
      jazzcashName: form.jazzcashName,
      tagline: form.tagline,
      address: form.address,
      businessHours: form.businessHours,
      heroHeadline: form.heroHeadline,
      heroDescription: form.heroDescription,
      ctaText: form.ctaText,
      footerInfo: form.footerInfo,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      paymentInstructions: form.paymentInstructions,
      bookingPolicy: form.bookingPolicy,
      cancellationPolicy: form.cancellationPolicy,
      refundPolicy: form.refundPolicy,
      instagram: [
        { handle: form.instagramHandle1, url: form.instagramUrl1 },
        { handle: form.instagramHandle2, url: form.instagramUrl2 },
      ],
    });
    notify('Website & WhatsApp configuration saved.');
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs max-w-4xl"
    >
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900">
          Website &amp; WhatsApp Configuration
        </h2>
        <p className="text-xs text-slate-600">
          Update public contact details, WhatsApp (03155449778 / 923155449778), Hero copy, SEO, and payment instructions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Local Phone (03155449778)
          </label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900 font-mono-num"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            International WhatsApp (923155449778)
          </label>
          <input
            type="text"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900 font-mono-num"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Public Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">JazzCash Number</label>
          <input
            type="text"
            value={form.jazzcashNumber}
            onChange={(e) => setForm({ ...form, jazzcashNumber: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900 font-mono-num"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            JazzCash Account Name
          </label>
          <input
            type="text"
            value={form.jazzcashName}
            onChange={(e) => setForm({ ...form, jazzcashName: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Headline</label>
          <input
            type="text"
            value={form.heroHeadline}
            onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">CTA Banner Text</label>
          <input
            type="text"
            value={form.ctaText}
            onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Description</label>
        <textarea
          rows={2}
          value={form.heroDescription}
          onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
          className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Title</label>
          <input
            type="text"
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Footer Information
          </label>
          <input
            type="text"
            value={form.footerInfo}
            onChange={(e) => setForm({ ...form, footerInfo: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Description</label>
        <textarea
          rows={2}
          value={form.seoDescription}
          onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
          className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Instagram Handle 1 &amp; URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.instagramHandle1}
              onChange={(e) => setForm({ ...form, instagramHandle1: e.target.value })}
              className="w-1/3 px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
            <input
              type="text"
              value={form.instagramUrl1}
              onChange={(e) => setForm({ ...form, instagramUrl1: e.target.value })}
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Instagram Handle 2 &amp; URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.instagramHandle2}
              onChange={(e) => setForm({ ...form, instagramHandle2: e.target.value })}
              className="w-1/3 px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
            <input
              type="text"
              value={form.instagramUrl2}
              onChange={(e) => setForm({ ...form, instagramUrl2: e.target.value })}
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Payment Instructions
        </label>
        <textarea
          rows={2}
          value={form.paymentInstructions}
          onChange={(e) => setForm({ ...form, paymentInstructions: e.target.value })}
          className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Tagline</label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Business Hours</label>
          <input
            type="text"
            value={form.businessHours}
            onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Policy</label>
          <textarea
            rows={2}
            value={form.bookingPolicy}
            onChange={(e) => setForm({ ...form, bookingPolicy: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Cancellation Policy
          </label>
          <textarea
            rows={2}
            value={form.cancellationPolicy}
            onChange={(e) => setForm({ ...form, cancellationPolicy: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Refund Policy</label>
          <textarea
            rows={2}
            value={form.refundPolicy}
            onChange={(e) => setForm({ ...form, refundPolicy: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
      >
        Save Website Settings
      </button>
    </form>
  );
};

export const AdminUsersSection: React.FC<{
  notify: (msg: string) => void;
  askConfirm: (message: string, onConfirm: () => void, confirmLabel?: string) => void;
}> = ({ notify, askConfirm }) => {
  const {
    adminUsers,
    isSuperAdmin,
    createAdminAccount,
    updateAdminAccountRole,
    deleteAdminAccount,
    changeAdminPassword,
  } = useApp();

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');

  const [currPass, setCurrPass] = useState('');
  const [nextPass, setNextPass] = useState('');

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || newPassword.length < 6) return;
    askConfirm(
      `Grant ${newRole} privileges to "${newEmail.trim()}"?`,
      async () => {
        const res = await createAdminAccount({
          email: newEmail.trim(),
          displayName: newName.trim() || newEmail.trim(),
          password: newPassword,
          role: newRole,
        });
        if (res.success) {
          notify(`Created administrator ${newEmail.trim()}.`);
          setNewEmail('');
          setNewName('');
          setNewPassword('');
        } else {
          notify(res.error || 'Could not create administrator.');
        }
      },
      'CREATE ADMIN'
    );
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changeAdminPassword(currPass, nextPass);
    if (res.success) {
      notify('Admin password updated securely.');
      setCurrPass('');
      setNextPass('');
    } else {
      notify(res.error || 'Failed to change password.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Create Admin & Change Password */}
        <div className="lg:col-span-5 space-y-6">
          {isSuperAdmin && (
            <form
              onSubmit={handleCreateAdmin}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <h2 className="font-display text-base font-bold text-slate-900">
                  Add Administrator (Super Admin Only)
                </h2>
              </div>
              <input
                type="text"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Admin Email / Username *"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Display Name"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Initial Password (min 6 chars) *"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'SUPER_ADMIN')}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs font-semibold text-slate-900"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
              >
                Create Administrator
              </button>
            </form>
          )}

          <form
            onSubmit={handlePasswordChange}
            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <h2 className="font-display text-base font-bold text-slate-900">
                Change Your Admin Password
              </h2>
            </div>
            <input
              type="password"
              required
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
              placeholder="Current Password *"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
            <input
              type="password"
              required
              minLength={6}
              value={nextPass}
              onChange={(e) => setNextPass(e.target.value)}
              placeholder="New Password (min 6 chars) *"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
            >
              Update Admin Password
            </button>
          </form>
        </div>

        {/* Right: Authorized Admin Accounts List */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Authorized Administrators ({adminUsers.length})
              </h2>
              <p className="text-xs text-slate-600">
                Normal customers never receive administrative permissions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {adminUsers.map((adm) => {
              const isPrimarySuper =
                adm.uid === 'super_admin_baigtours' ||
                adm.email.toLowerCase() === 'admit@baigtours' ||
                adm.email.toLowerCase() === 'admin@baigtours';
              return (
                <div
                  key={adm.uid}
                  className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-700" />
                      <span className="text-sm font-bold text-slate-900">{adm.displayName}</span>
                      <span className="text-xs font-mono-num font-bold text-emerald-800">
                        {adm.role}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        ({adm.status})
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-mono-num mt-0.5">{adm.email}</div>
                    {adm.lastLoginAt && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Last login: {new Date(adm.lastLoginAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {!isPrimarySuper && isSuperAdmin && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          askConfirm(
                            `Change role for ${adm.email} to ${
                              adm.role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN'
                            }?`,
                            async () => {
                              const nextRole =
                                adm.role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN';
                              await updateAdminAccountRole(adm.uid, nextRole, adm.status);
                              notify(`Updated role for ${adm.email}.`);
                            },
                            'CONFIRM ROLE CHANGE'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
                      >
                        Toggle Role
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const nextStatus = adm.status === 'active' ? 'disabled' : 'active';
                          await updateAdminAccountRole(adm.uid, adm.role, nextStatus);
                          notify(`Set ${adm.email} status to ${nextStatus}.`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
                      >
                        {adm.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          askConfirm(
                            `Remove admin privileges and delete administrator "${adm.email}"?`,
                            async () => {
                              await deleteAdminAccount(adm.uid);
                              notify(`Deleted administrator ${adm.email}.`);
                            }
                          )
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminAuditLogsSection: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(
    (log) =>
      !search.trim() ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.targetName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Admin Security &amp; Activity Audit Logs ({auditLogs.length})
          </h2>
          <p className="text-xs text-slate-600">
            Chronological accountability record of administrative logins and content changes.
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by action, admin, record..."
            className="pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-600">
          0 audit log entries match your filter.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="p-3.5">Date / Time</th>
                <th className="p-3.5">Admin Account</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Record Affected</th>
                <th className="p-3.5">Relevant Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5 font-mono-num text-slate-600 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className="font-mono-num font-bold text-slate-900">
                      {log.adminEmail}
                    </span>
                    <span className="block text-[10px] text-slate-500">{log.adminRole}</span>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-800">{log.action}</td>
                  <td className="p-3.5 font-semibold text-slate-900">
                    {log.targetName}{' '}
                    <span className="text-slate-400 font-normal">({log.targetType})</span>
                  </td>
                  <td className="p-3.5 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const AdminDryFruitsSection: React.FC<{
  notify: (msg: string) => void;
  askConfirm: (message: string, onConfirm: () => void, confirmLabel?: string) => void;
}> = ({ notify, askConfirm }) => {
  const {
    allDryFruits,
    saveDryFruitAdmin,
    deleteDryFruitAdmin,
    togglePublishDryFruitAdmin,
    toggleStockDryFruitAdmin,
    toggleFeatureDryFruitAdmin,
    resetDryFruitsToDefault,
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'inStock' | 'outOfStock'>('All');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<DryFruitProduct>(EMPTY_DRY_FRUIT_TEMPLATE);
  const [benefitsInput, setBenefitsInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showSampleImages, setShowSampleImages] = useState(false);

  // Filtered Products
  const filteredProducts = allDryFruits.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.urduName && p.urduName.toLowerCase().includes(q)) ||
      (p.origin && p.origin.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q));

    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;

    const matchStock =
      stockFilter === 'All' ||
      (stockFilter === 'inStock' && p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0)) ||
      (stockFilter === 'outOfStock' && (!p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0)));

    return matchSearch && matchCategory && matchStock;
  });

  const totalCount = allDryFruits.length;
  const inStockCount = allDryFruits.filter((p) => p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0)).length;
  const outOfStockCount = totalCount - inStockCount;
  const featuredCount = allDryFruits.filter((p) => p.featured).length;

  const handleOpenAdd = () => {
    setFormData({
      ...EMPTY_DRY_FRUIT_TEMPLATE,
      id: '',
      pricing: { '250g': 850, '500g': 1650, '1kg': 3100 },
      originalPricing: { '250g': 0, '500g': 0, '1kg': 0 },
      discountPercent: 0,
      stockQuantity: 50,
      inStock: true,
      published: true,
      featured: false,
    });
    setBenefitsInput(EMPTY_DRY_FRUIT_TEMPLATE.healthBenefits.join('\n'));
    setIsEditing(false);
    setFormError(null);
    setShowSampleImages(false);
    setShowModal(true);
  };

  const handleOpenEdit = (product: DryFruitProduct) => {
    setFormData({
      ...product,
      pricing: {
        '250g': product.pricing['250g'] || 0,
        '500g': product.pricing['500g'] || 0,
        '1kg': product.pricing['1kg'] || 0,
      },
      originalPricing: {
        '250g': product.originalPricing?.['250g'] || 0,
        '500g': product.originalPricing?.['500g'] || 0,
        '1kg': product.originalPricing?.['1kg'] || 0,
      },
      discountPercent: product.discountPercent || 0,
      stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 50,
      inStock: product.inStock !== false,
      published: product.published !== false,
      featured: Boolean(product.featured),
    });
    setBenefitsInput((product.healthBenefits || []).join('\n'));
    setIsEditing(true);
    setFormError(null);
    setShowSampleImages(false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const name = formData.name.trim();
    if (!name) {
      setFormError('Product Name is required.');
      return;
    }

    const p250 = Number(formData.pricing['250g']) || 0;
    const p500 = Number(formData.pricing['500g']) || 0;
    const p1kg = Number(formData.pricing['1kg']) || 0;

    if (p250 <= 0 || p500 <= 0 || p1kg <= 0) {
      setFormError('Please enter valid positive PKR prices for all weight tiers (250g, 500g, and 1kg).');
      return;
    }

    if (!formData.imageUrl.trim()) {
      setFormError('Product image URL is required.');
      return;
    }

    const benefits = benefitsInput
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const productPayload: DryFruitProduct = {
      ...formData,
      name,
      urduName: formData.urduName.trim(),
      category: formData.category || 'Nuts & Kernels',
      tagline: formData.tagline.trim(),
      description: formData.description.trim(),
      healthBenefits: benefits.length > 0 ? benefits : ['Freshly harvested & natural wellness'],
      origin: formData.origin.trim() || 'Gilgit-Baltistan & Northern Pakistan',
      pricing: {
        '250g': p250,
        '500g': p500,
        '1kg': p1kg,
      },
      originalPricing: {
        '250g': Number(formData.originalPricing?.['250g']) || 0,
        '500g': Number(formData.originalPricing?.['500g']) || 0,
        '1kg': Number(formData.originalPricing?.['1kg']) || 0,
      },
      discountPercent: Math.max(0, Math.min(100, Number(formData.discountPercent) || 0)),
      stockQuantity: Math.max(0, Number(formData.stockQuantity) || 0),
      inStock: Boolean(formData.inStock),
      featured: Boolean(formData.featured),
      published: Boolean(formData.published),
    };

    setIsSubmitting(true);
    try {
      const res = await saveDryFruitAdmin(productPayload);
      if (res.success) {
        notify(isEditing ? `Updated product "${name}".` : `Created product "${name}".`);
        setShowModal(false);
      } else {
        setFormError(res.error || 'Failed to save product.');
      }
    } catch {
      setFormError('An unexpected error occurred while saving the product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (product: DryFruitProduct) => {
    askConfirm(
      `Delete product "${product.name}"? This will permanently remove it from the store catalog.`,
      async () => {
        const res = await deleteDryFruitAdmin(product.id);
        if (res.success) {
          notify(`Deleted product "${product.name}".`);
        } else {
          notify(`Error: ${res.error || 'Could not delete product.'}`);
        }
      },
      'DELETE PRODUCT'
    );
  };

  const handleResetCatalog = () => {
    askConfirm(
      'Reset all dry fruit products to default catalog? Any custom products or edits will be replaced with initial harvest products.',
      async () => {
        await resetDryFruitsToDefault();
        notify('Dry fruits catalog restored to defaults.');
      },
      'RESTORE DEFAULTS'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                <ShoppingBag className="w-5 h-5 text-amber-800" />
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                Manage Dry Fruits Store
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Add, edit, and organize dry fruit catalog items, weight-based pricing in PKR, stock counts, discounts, and availability. Changes immediately reflect on the live customer store.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetCatalog}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              title="Reset catalog to initial dry fruits"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 text-xs font-bold bg-[#183C30] hover:bg-[#0F261F] text-[#F4EFDF] border border-[#B99A58]/40 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-[#B99A58]" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Total Products</span>
            <div className="text-xl font-bold font-mono-num text-slate-900 mt-0.5">{totalCount}</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-emerald-700 font-medium">In Stock</span>
            <div className="text-xl font-bold font-mono-num text-emerald-900 mt-0.5">{inStockCount}</div>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
            <span className="text-rose-700 font-medium">Out of Stock</span>
            <div className="text-xl font-bold font-mono-num text-rose-900 mt-0.5">{outOfStockCount}</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-amber-800 font-medium">Featured Items</span>
            <div className="text-xl font-bold font-mono-num text-amber-900 mt-0.5">{featuredCount}</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, Urdu name, origin, or description..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {DRY_FRUITS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as 'All' | 'inStock' | 'outOfStock')}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">Stock: All</option>
            <option value="inStock">In Stock Only</option>
            <option value="outOfStock">Out of Stock Only</option>
          </select>

          {(search || categoryFilter !== 'All' || stockFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setStockFilter('All');
              }}
              className="px-2.5 py-2 text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-display text-base font-bold text-slate-800">No Dry Fruit Products Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No products match your current search query or filter. Adjust your search or add a new dry fruit product.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Product</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-3.5">Product & Details</th>
                  <th className="p-3.5">Category & Origin</th>
                  <th className="p-3.5">Pricing in PKR (250g / 500g / 1kg)</th>
                  <th className="p-3.5">Stock & Availability</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((p) => {
                  const isInStock = p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0);
                  const hasDiscount = (p.discountPercent || 0) > 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Thumbnail & Names */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  p.fallbackImageUrl ||
                                  'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=400&q=80';
                              }}
                              className="w-full h-full object-cover"
                            />
                            {p.badge && (
                              <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-[#C5A46D] font-bold text-center py-0.5 truncate px-1">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div className="space-y-0.5 min-w-0 max-w-[200px]">
                            <div className="font-bold text-slate-900 truncate">{p.name}</div>
                            {p.urduName && (
                              <div className="text-[11px] text-slate-500 font-sans truncate">{p.urduName}</div>
                            )}
                            <div className="text-[10px] text-slate-400 truncate">{p.tagline || p.description}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Origin */}
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-[10px] font-semibold">
                          {p.category}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1 truncate max-w-[150px]">{p.origin}</div>
                      </td>

                      {/* Pricing Tiers */}
                      <td className="p-3.5">
                        <div className="space-y-1 font-mono-num">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-[10px] w-8">250g:</span>
                            <span className="font-bold text-slate-900">PKR {p.pricing['250g'].toLocaleString()}</span>
                            {p.originalPricing?.['250g'] ? (
                              <span className="text-slate-400 line-through text-[10px]">
                                PKR {p.originalPricing['250g'].toLocaleString()}
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-[10px] w-8">500g:</span>
                            <span className="font-bold text-emerald-800">PKR {p.pricing['500g'].toLocaleString()}</span>
                            {p.originalPricing?.['500g'] ? (
                              <span className="text-slate-400 line-through text-[10px]">
                                PKR {p.originalPricing['500g'].toLocaleString()}
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-[10px] w-8">1kg:</span>
                            <span className="font-bold text-slate-900">PKR {p.pricing['1kg'].toLocaleString()}</span>
                            {p.originalPricing?.['1kg'] ? (
                              <span className="text-slate-400 line-through text-[10px]">
                                PKR {p.originalPricing['1kg'].toLocaleString()}
                              </span>
                            ) : null}
                          </div>
                          {hasDiscount && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">
                              <Percent className="w-2.5 h-2.5" /> {p.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock & Availability */}
                      <td className="p-3.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                await toggleStockDryFruitAdmin(p.id);
                                notify(`Product "${p.name}" marked ${p.inStock ? 'Out of Stock' : 'In Stock'}.`);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                isInStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                              title="Click to toggle stock availability"
                            >
                              {isInStock ? (
                                <>
                                  <PackageCheck className="w-3 h-3" />
                                  <span>In Stock</span>
                                </>
                              ) : (
                                <>
                                  <PackageX className="w-3 h-3" />
                                  <span>Out of Stock</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono-num">
                            Qty: <strong className="text-slate-800">{p.stockQuantity !== undefined ? p.stockQuantity : 50}</strong> units
                          </div>
                        </div>
                      </td>

                      {/* Status Badges */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          {/* Publish Toggle */}
                          <button
                            type="button"
                            onClick={async () => {
                              await togglePublishDryFruitAdmin(p.id);
                              notify(`Product "${p.name}" ${p.published !== false ? 'hidden' : 'published'}.`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                              p.published !== false
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                            title="Toggle public visibility"
                          >
                            {p.published !== false ? (
                              <>
                                <Eye className="w-3 h-3 text-slate-500" />
                                <span>Live</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-amber-600" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>

                          {/* Featured Toggle */}
                          <button
                            type="button"
                            onClick={async () => {
                              await toggleFeatureDryFruitAdmin(p.id);
                              notify(`Product "${p.name}" ${p.featured ? 'unfeatured' : 'featured'}.`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                              p.featured
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Toggle featured status on homepage"
                          >
                            <Star className={`w-3 h-3 ${p.featured ? 'text-amber-600 fill-amber-500' : ''}`} />
                            <span>{p.featured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {isEditing ? `Edit Dry Fruit: ${formData.name}` : 'Add New Dry Fruit Product'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set up product information, weight-based pricing in PKR, and stock status.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Notification */}
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Product Name & Urdu Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Product Name (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Giri Almonds (Badam)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Urdu / Local Name</label>
                  <input
                    type="text"
                    value={formData.urduName}
                    onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                    placeholder="e.g. بادام گرئی (Badam)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-sans"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                  >
                    <option value="Nuts & Kernels">Nuts & Kernels</option>
                    <option value="Dried Fruits">Dried Fruits</option>
                    <option value="Specialty & Mixes">Specialty & Mixes</option>
                    <option value="Royal Gift Boxes">Royal Gift Boxes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Origin / Region</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Hunza Valley, Gilgit-Baltistan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Promotional Badge</label>
                  <select
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                  >
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Seasonal Harvest">Seasonal Harvest</option>
                    <option value="Royal Reserve">Royal Reserve</option>
                    <option value="Organic GB">Organic GB</option>
                  </select>
                </div>
              </div>

              {/* Tagline & Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Sun-dried and hand-shelled organic almonds from Gilgit orchards"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description of taste, texture, harvest season, and purity..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                />
              </div>

              {/* PRICING SECTION (250g, 500g, 1kg) */}
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                    <Tag className="w-4 h-4 text-amber-700" />
                    <span>Weight-Based Pricing in PKR & Discounts</span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-medium">All 3 tiers required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 250g */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="font-bold text-slate-900 block text-[11px]">250g Active Price (PKR) *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={formData.pricing['250g']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, '250g': Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono-num font-bold"
                    />
                    <label className="text-[10px] text-slate-500 block">Original Price (optional)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.originalPricing?.['250g'] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPricing: {
                            ...formData.originalPricing,
                            '250g': Number(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder="e.g. 1000"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-600 font-mono-num text-[11px]"
                    />
                  </div>

                  {/* 500g */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="font-bold text-slate-900 block text-[11px]">500g Active Price (PKR) *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={formData.pricing['500g']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, '500g': Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-emerald-800 font-mono-num font-bold"
                    />
                    <label className="text-[10px] text-slate-500 block">Original Price (optional)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.originalPricing?.['500g'] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPricing: {
                            ...formData.originalPricing,
                            '500g': Number(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder="e.g. 1900"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-600 font-mono-num text-[11px]"
                    />
                  </div>

                  {/* 1kg */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="font-bold text-slate-900 block text-[11px]">1kg Active Price (PKR) *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={formData.pricing['1kg']}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, '1kg': Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono-num font-bold"
                    />
                    <label className="text-[10px] text-slate-500 block">Original Price (optional)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.originalPricing?.['1kg'] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPricing: {
                            ...formData.originalPricing,
                            '1kg': Number(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder="e.g. 3600"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-600 font-mono-num text-[11px]"
                    />
                  </div>
                </div>

                {/* Discount % & Stock Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-rose-600" />
                      <span>Discount Percentage (%)</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.discountPercent || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, discountPercent: Number(e.target.value) || 0 })
                      }
                      placeholder="e.g. 15 for 15% OFF badge"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono-num"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Stock Quantity (Available Packs/Units)</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stockQuantity !== undefined ? formData.stockQuantity : 50}
                      onChange={(e) =>
                        setFormData({ ...formData, stockQuantity: Number(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono-num font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Product Image & Sample Image Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Product Image URL *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSampleImages(!showSampleImages)}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold underline text-[11px]"
                  >
                    {showSampleImages ? 'Hide sample images' : 'Choose from high-res dry fruit photos'}
                  </button>
                </div>

                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                />

                {/* Sample Image Grid Picker */}
                {showSampleImages && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="text-[11px] font-semibold text-slate-600">
                      Click any photo below to instantly use it for this product:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {SAMPLE_DRY_FRUIT_IMAGES.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              imageUrl: img.url,
                              fallbackImageUrl: img.url,
                            });
                            setShowSampleImages(false);
                          }}
                          className="group relative rounded-xl overflow-hidden border-2 border-transparent hover:border-emerald-600 transition-all text-left aspect-[4/3]"
                        >
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/75 p-1 text-[9px] text-white font-medium truncate">
                            {img.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Live Preview */}
                {formData.imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-200 border border-slate-300"
                    />
                    <div className="min-w-0 flex-1 text-[11px] text-slate-500 truncate">
                      Image Preview: <span className="text-slate-800 font-mono-num">{formData.imageUrl}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Health Benefits (one per line) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Health Benefits & Key Highlights (one per line)</label>
                <textarea
                  rows={2}
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  placeholder="Rich in Vitamin E & antioxidants&#10;Supports heart and brain health&#10;100% natural, no preservatives"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                />
              </div>

              {/* Toggles: In-Stock, Featured, Published */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="font-bold text-slate-800">In Stock for Sale</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300"
                  />
                  <span className="font-bold text-slate-800">Featured in Highlights</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="font-bold text-slate-800">Visible on Live Site</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-[#183C30] hover:bg-[#0F261F] text-[#F4EFDF] border border-[#B99A58]/50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#B99A58]" />
                      <span>{isEditing ? 'Save Product Changes' : 'Create Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

