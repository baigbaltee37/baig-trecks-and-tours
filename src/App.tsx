/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ToursPage } from './pages/ToursPage';
import { TourDetailPage } from './pages/TourDetailPage';
import { DestinationsPage, DestinationDetailPage } from './pages/DestinationsPage';
import {
  ExperiencesPage,
  AboutPage,
  GalleryPage,
  TravelGuidesPage,
  TravelGuideDetailPage,
  ContactPage,
  NotFoundPage,
} from './pages/SecondaryPages';
import {
  AuthPage,
  CustomerDashboardPage,
  MyBookingsPage,
  ProfilePage,
} from './pages/AuthAndCustomerPages';
import { AdminLoginPage, AdminDashboardPage } from './pages/AdminPages';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tours/:slug" element={<TourDetailPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/guides" element={<TravelGuidesPage />} />
            <Route path="/guides/:slug" element={<TravelGuideDetailPage />} />
            <Route path="/travel-guides" element={<TravelGuidesPage />} />
            <Route path="/travel-guides/:slug" element={<TravelGuideDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
            <Route path="/reset-password" element={<AuthPage mode="reset" />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/customer" element={<CustomerDashboardPage />} />
            <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/baig-admin-secure-786" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/tours" element={<AdminDashboardPage />} />
            <Route path="/admin/destinations" element={<AdminDashboardPage />} />
            <Route path="/admin/bookings" element={<AdminDashboardPage />} />
            <Route path="/admin/inquiries" element={<AdminDashboardPage />} />
            <Route path="/admin/customers" element={<AdminDashboardPage />} />
            <Route path="/admin/gallery" element={<AdminDashboardPage />} />
            <Route path="/admin/reviews" element={<AdminDashboardPage />} />
            <Route path="/admin/guides" element={<AdminDashboardPage />} />
            <Route path="/admin/content" element={<AdminDashboardPage />} />
            <Route path="/admin/settings" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminDashboardPage />} />
            <Route path="/admin/audit-logs" element={<AdminDashboardPage />} />
            <Route path="/admin/*" element={<AdminDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
