
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
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2, Edit, ListFilter, ArrowUpDown } from 'lucide-react'; 
import type { Post } from '@/services/posts'; 
import { Badge } from '@/components/ui/badge';

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

interface PostsDataTableProps {
    columns: any[];
    data: any[];
    searchColumnId?: string;
    filterColumnId?: string;
    filterColumnName?: string;
    searchPlaceholder?: string;
}

export function PostsDataTable({ columns: propColumns, data, searchColumnId = 'title', filterColumnId, filterColumnName, searchPlaceholder = 'Search for post...' }: PostsDataTableProps) {
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
            cell: ({ row }: { row: any }) => {
                const value = row.getValue(col.accessorKey);
                if (Array.isArray(value)) {
                    return (
                        <div className="flex flex-wrap gap-1 pl-4">
                            {(value as string[]).map(tag => (
                                <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                            ))}
                        </div>
                    )
                }
                return (
                    <div className={col.accessorKey === 'title' || col.accessorKey === 'email' ? 'font-medium pl-4' : 'pl-4'}>
                        {value}
                    </div>
                )
            },
        })),
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
  
  const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined;
  const filterValues = React.useMemo(() => {
    if (!filterColumn || !filterColumnId) return [];
    const values = new Set<string>();
    data.forEach(row => {
      const cellValue = row[filterColumnId];
      if (Array.isArray(cellValue)) {
        cellValue.forEach(v => values.add(v));
      } else if (typeof cellValue === 'string') {
        values.add(cellValue);
      }
    });
    return Array.from(values);
  }, [data, filterColumnId, filterColumn]);


  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn(searchColumnId)?.setFilterValue(event.target.value)
           }
          }
          className="max-w-sm"
        />

        {filterColumn && filterColumnName && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Filter by {filterColumnName}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by {filterColumnName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filterValues.map(value => (
                        <DropdownMenuCheckboxItem
                            key={value}
                            checked={(filterColumn.getFilterValue() as string[] ?? []).includes(value)}
                            onCheckedChange={(checked) => {
                                const currentFilter = (filterColumn.getFilterValue() as string[] ?? []);
                                let newFilter;
                                if (checked) {
                                    newFilter = [...currentFilter, value];
                                } else {
                                    newFilter = currentFilter.filter(v => v !== value);
                                }
                                filterColumn.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
                            }}
                        >
                            {value}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )}

        <div className="flex-grow" />

         {selectedRowCount > 0 && (
            <Button
                variant="destructive"
                size="sm"
                className="ml-auto"
                onClick={() => {
                const selectedRows = table.getFilteredSelectedRowModel().rows;
                const selectedIds = selectedRows.map(row => row.original.id || row.original.slug);
                console.log('Delete selected items:', selectedIds);
                }}
            >
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedRowCount})
            </Button>
         )}

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
