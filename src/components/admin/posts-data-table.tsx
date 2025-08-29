
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2, Edit, ListFilter, ArrowUpDown } from 'lucide-react'; 
import type { Post } from '@/services/posts'; 

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

  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
        selectionColumn,
        ...propColumns.map((col) => ({
            accessorKey: col.accessorKey,
            header: ({ column }: { column: any}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {col.header}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => (
                <div className={col.accessorKey === 'title' ? 'font-medium pl-4' : 'pl-4'}>
                {Array.isArray(row.getValue(col.accessorKey))
                    ? (row.getValue(col.accessorKey) as string[]).join(', ')
                    : row.getValue(col.accessorKey)}
                </div>
            ),
        })),
        actionsColumn,
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
  const uniqueAuthors = React.useMemo(() => Array.from(new Set(data.map(post => post.author))), [data]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search for post..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-9"
        />

        {/* Filter By Dropdown */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Author</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup 
                    value={table.getColumn('author')?.getFilterValue() as string ?? ''}
                    onValueChange={(value) => {
                        table.getColumn('author')?.setFilterValue(value === table.getColumn('author')?.getFilterValue() ? undefined : value)
                    }}
                >
                {uniqueAuthors.map(author => (
                    <DropdownMenuRadioItem key={author} value={author}>{author}</DropdownMenuRadioItem>
                ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-grow" />

         <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            disabled={selectedRowCount === 0}
            onClick={() => {
              const selectedRows = table.getFilteredSelectedRowModel().rows;
              const selectedSlugs = selectedRows.map(row => row.original.slug);
              console.log('Delete selected posts:', selectedSlugs);
            }}
         >
            <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedRowCount})
         </Button>

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
