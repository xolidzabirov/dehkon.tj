'use client';

import React from 'react';
import { AdminLayout } from '@/widgets/admin-layout';

export const dynamic = 'force-dynamic';

export default function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
