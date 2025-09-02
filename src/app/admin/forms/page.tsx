
'use client';

import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firestore';
import { collection, getDocs, query } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Form } from '@/types/subscriber';

// Placeholder course data and columns
const formColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'isPublic',
    header: 'Public',
  },
];


export default function AdminFormsPage() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    const fetchForms = async () => {
        try {
            const formsSnapshot = await getDocs(query(collection(db, 'forms')));
            if (!formsSnapshot.empty) {
                const formsData = formsSnapshot.docs.map(doc => ({ ...doc.data() } as Form));
                setForms(formsData);
            }
        } catch (error) {
            console.error("Error fetching forms:", error);
        }
    }
    fetchForms();
  }, []);

  return (
    <div>
        <h1 className="text-4xl font-bold font-heading mb-8">Manage Forms</h1>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Forms</CardTitle>
                    <Button asChild>
                      <Link href="/admin/forms/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                      </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <PostsDataTable columns={formColumns} data={forms} searchColumnId="name" />
            </CardContent>
        </Card>
    </div>
  );
}
