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
} from 'lucide-react';
import { useApp, InquiryRecord, BookingRecord } from '../context/AppContext';
import { GalleryImageItem, ReviewItem, VISUAL_ASSETS } from '../data/initialData';

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
  const { bookings, updateBookingAdmin, deleteBookingAdmin } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
            Verify payment screenshots before marking any booking as PAID.
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
        </div>
      </div>

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
                  <td className="p-3.5 text-right">
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

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Customer Inquiries ({inquiries.length})
        </h2>
        <p className="text-xs text-slate-600">
          Manage inquiry statuses and private admin internal notes (never visible to customers).
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-600">
          0 customer inquiries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {inquiries.map((inq) => {
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
  const { allUsers, updateCustomerStatusAdmin, deleteCustomerAdmin } = useApp();
  const [search, setSearch] = useState('');

  const filtered = allUsers.filter(
    (u) =>
      !search.trim() ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Registered Customers ({allUsers.length})
          </h2>
          <p className="text-xs text-slate-600">
            Customer passwords and authentication secrets are strictly hidden.
          </p>
        </div>
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
      </div>

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
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        askConfirm(`Delete customer account "${u.email}"?`, async () => {
                          await deleteCustomerAdmin(u.uid);
                          notify(`Deleted customer ${u.email}.`);
                        })
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
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
    heroHeadline: business.heroHeadline,
    heroDescription: business.heroDescription,
    ctaText: business.ctaText || '',
    footerInfo: business.footerInfo || '',
    seoTitle: business.seoTitle || '',
    seoDescription: business.seoDescription || '',
    paymentInstructions: business.paymentInstructions,
    bookingPolicy: business.bookingPolicy,
    cancellationPolicy: business.cancellationPolicy,
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
      heroHeadline: form.heroHeadline,
      heroDescription: form.heroDescription,
      ctaText: form.ctaText,
      footerInfo: form.footerInfo,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      paymentInstructions: form.paymentInstructions,
      bookingPolicy: form.bookingPolicy,
      cancellationPolicy: form.cancellationPolicy,
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
              const isPrimarySuper = adm.email.toLowerCase() === 'admin@baigtours';
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
                    </div>
                    <div className="text-xs text-slate-600 font-mono-num mt-0.5">{adm.email}</div>
                    {adm.lastLoginAt && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Last login: {new Date(adm.lastLoginAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {!isPrimarySuper && isSuperAdmin && (
                    <div className="flex items-center gap-2">
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
