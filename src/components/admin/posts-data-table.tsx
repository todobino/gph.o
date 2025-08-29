
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2, Edit } from 'lucide-react'; // Import Trash2 and Edit icons
import type { Post } from '@/services/posts'; // Assuming Post type is available

// Add selection column definition
const selectionColumn: ColumnDef<Post> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
};

// Add actions column definition
const actionsColumn: ColumnDef<Post> = {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="flex space-x-2">
            {/* Placeholder Edit Button */}
            <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => console.log('Edit post:', post.slug)} // Placeholder action
            aria-label={`Edit post ${post.title}`}
            disabled // Disable until functionality is added
            >
                <Edit className="h-4 w-4" />
            </Button>
            {/* Placeholder Delete Button */}
            <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => console.log('Delete post:', post.slug)} // Placeholder action
            aria-label={`Delete post ${post.title}`}
            disabled // Disable until functionality is added
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  };


export function PostsDataTable({ columns: propColumns, data }: { columns: any[], data: any[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Define columns dynamically based on props, adding selection and actions
  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
        selectionColumn, // Add selection column first
        ...propColumns.map((col) => ({
            accessorKey: col.accessorKey,
            header: col.header,
            cell: ({ row }: { row: any }) => (
                <div className={col.accessorKey === 'title' ? 'font-medium' : ''}>
                {/* Handle potential array data like tags */}
                {Array.isArray(row.getValue(col.accessorKey))
                    ? (row.getValue(col.accessorKey) as string[]).join(', ')
                    : row.getValue(col.accessorKey)}
                </div>
            ),
        })),
        actionsColumn, // Add actions column last
    ],
    [propColumns]
 );


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRowCount = Object.keys(rowSelection).length;

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        {/* Filter Input */}
        <Input
          placeholder="Search for post..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Bulk Actions Button (Placeholder) */}
         <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            disabled={selectedRowCount === 0} // Disable if no rows selected
            onClick={() => {
              const selectedRows = table.getFilteredSelectedRowModel().rows;
              const selectedSlugs = selectedRows.map(row => row.original.slug);
              console.log('Delete selected posts:', selectedSlugs); // Placeholder action
            }}
         >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected ({selectedRowCount})
         </Button>

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide() && column.id !== 'select' && column.id !== 'actions') // Exclude select and actions columns
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
