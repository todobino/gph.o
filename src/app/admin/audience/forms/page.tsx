
'use client';

import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firestore';
import { useIsAdmin } from '@/hooks/useUser';
import { collection, getDocs, query } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Form } from '@/types/subscriber';
import { Skeleton } from '@/components/ui/skeleton';


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
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (isAdmin !== true) return; // Wait for admin check

    const fetchForms = async () => {
        try {
            const formsSnapshot = await getDocs(query(collection(db, 'forms')));
            if (!formsSnapshot.empty) {
                const formsData = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Form));
                setForms(formsData);
            }
        } catch (error) {
            console.error("Error fetching forms:", error);
        }
    }
    fetchForms();
  }, [isAdmin]);

  if (isAdmin === undefined) {
    return (
       <Card>
          <CardHeader>
              <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
              <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
              </div>
          </CardContent>
      </Card>
    );
  }

  return (
    <div>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Forms</CardTitle>
                    <Button asChild>
                      <Link href="/admin/audience/forms/new">
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
