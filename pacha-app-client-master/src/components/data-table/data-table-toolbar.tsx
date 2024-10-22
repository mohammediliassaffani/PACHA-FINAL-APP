import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';
import NumberFilter from './data-table-number-filter';
import { DataTableFilterField } from '@/common/types';
import { DateRangePicker } from '../ui/date-range-picker';

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns, numberColumns } =
    React.useMemo(() => {
      return {
        searchableColumns: filterFields.filter(
          (field) => !field.options && !field.numberOptition
        ),
        numberColumns: filterFields.filter((field) => field.numberOptition),
        filterableColumns: filterFields.filter((field) => field.options),
      };
    }, [filterFields]);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between space-x-2 overflow-auto p-1',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column, i) =>
              table.getColumn(column.value ? String(column.value) : '') &&
              !column.advance && (
                <React.Fragment key={'' + i}>
                  {column.dateRange ? (
                    <DateRangePicker
                      key={String(column.value) + i}
                      triggerClassName="h-8 w-40 lg:w-64"
                      placeholder={column.placeholder}
                      queryNames={{
                        to: 'to' + String(column.value),
                        from: 'from' + String(column.value),
                      }}
                    />
                  ) : (
                    <Input
                      key={String(column.value) + i}
                      placeholder={column.placeholder}
                      value={
                        (table
                          .getColumn(String(column.value))
                          ?.getFilterValue() as string) ?? ''
                      }
                      onChange={(event) =>
                        table
                          .getColumn(String(column.value))
                          ?.setFilterValue(event.target.value)
                      }
                      className="h-8 w-40 lg:w-64"
                    />
                  )}
                </React.Fragment>
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') &&
              !column.advance && (
                <DataTableFacetedFilter
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : ''
                  )}
                  title={column.label}
                  options={column.options ?? []}
                />
              )
          )}
        {numberColumns.length > 0 &&
          numberColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') &&
              !column.advance && (
                <NumberFilter
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : ''
                  )}
                  numberOptition={column.numberOptition}
                />
              )
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
