import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import type { DataTableFilterOption } from '@/common/types';
import {
  CopyIcon,
  DotsHorizontalIcon,
  TextAlignCenterIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

import {
  dataTableConfig,
  type DataTableConfig,
} from '@/common/config/data-table';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { DataTableFacetedFilter } from '../data-table-faceted-filter';
import { Slider } from '@/components/ui/slider';

interface DataTableMultiFilterProps<TData> {
  table: Table<TData>;
  allOptions: DataTableFilterOption<TData>[];
  options: DataTableFilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >;
  defaultOpen: boolean;
}

export function DataTableMultiFilter<TData>({
  table,
  allOptions,
  options,
  setSelectedOptions,
  defaultOpen,
}: DataTableMultiFilterProps<TData>) {
  const [open, setOpen] = React.useState(defaultOpen);

  const [operator, setOperator] = React.useState(
    dataTableConfig.logicalOperators[0]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 truncate rounded-full"
        >
          <TextAlignCenterIcon className="mr-2 size-3" aria-hidden="true" />
          {options.length} rule
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 text-xs" align="start">
        <div className="space-y-2 p-4">
          {options.map((option, i) => (
            <MultiFilterRow
              key={option.id ?? i}
              i={i}
              option={option}
              table={table}
              allOptions={allOptions}
              options={options}
              setSelectedOptions={setSelectedOptions}
              operator={operator}
              setOperator={setOperator}
            />
          ))}
        </div>
        <Separator />
        <div className="p-1">
          <Button
            aria-label="Delete filter"
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setSelectedOptions((prev) =>
                prev.filter((item) => !item.isMulti)
              );
            }}
          >
            Delete filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface MultiFilterRowProps<TData> {
  i: number;
  table: Table<TData>;
  allOptions: DataTableFilterOption<TData>[];
  option: DataTableFilterOption<TData>;
  options: DataTableFilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >;
  operator?: DataTableConfig['logicalOperators'][number];
  setOperator: React.Dispatch<
    React.SetStateAction<
      DataTableConfig['logicalOperators'][number] | undefined
    >
  >;
}

export function MultiFilterRow<TData>({
  i,
  table,
  option,
  allOptions,
  options,
  setSelectedOptions,
  operator,
  setOperator,
}: MultiFilterRowProps<TData>) {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = React.useState('');
  const debouncedValue = useDebounce(value, 500);

  const [selectedOption, setSelectedOption] = React.useState<
    DataTableFilterOption<TData> | undefined
  >(options[0]);

  const isRange =
    selectedOption?.numberOptition?.rangeMin ||
    selectedOption?.numberOptition?.rangeMax;

  const filterVarieties = selectedOption?.numberOptition
    ? isRange
      ? []
      : ['Is', 'Is not', 'Greater than', 'Less than']
    : selectedOption?.options.length
      ? ['Is', 'Is not']
      : ['Contains', 'Does not contain', 'Is', 'Is not'];
  const [filterVariety, setFilterVariety] = React.useState(filterVarieties[0]);

  // Update filter variety
  React.useEffect(() => {
    if (selectedOption?.options.length) {
      setFilterVariety('is');
    }
  }, [selectedOption?.options.length]);

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = queryString.parse(location.search);

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          delete newSearchParams[key];
        } else {
          newSearchParams[key] = String(value);
        }
      }

      return queryString.stringify(newSearchParams);
    },
    [location.search]
  );

  // Update query string
  React.useEffect(() => {
    if (debouncedValue.length > 0) {
      const operatorValue = [
        ...dataTableConfig.comparisonOperators,
        { label: 'Greater than', value: 'gt' as const },
        { label: 'Less than', value: 'lt' as const },
      ].find((op) => op.label === filterVariety)?.value;
      navigate(
        `${location.pathname}?${createQueryString({
          [selectedOption?.value ?? '']: `${debouncedValue}${
            debouncedValue.length > 0 ? `~${operatorValue}` : ''
          }`,
        })}`,
        { replace: true, preventScrollReset: false }
      );
    }

    if (debouncedValue.length === 0) {
      navigate(
        `${location.pathname}?${createQueryString({
          [selectedOption?.value ?? '']: null,
        })}`,
        { replace: true, preventScrollReset: false }
      );
    }
  }, [
    debouncedValue,
    filterVariety,
    selectedOption?.value,
    navigate,
    location.pathname,
    createQueryString,
  ]);

  const handleNumberChange = (newValue: string) => {
    setValue(newValue);
  };

  // Update operator query string
  React.useEffect(() => {
    if (operator) {
      navigate(
        `${location.pathname}?${createQueryString({
          operator: operator.value,
        })}`,
        { replace: true, preventScrollReset: false }
      );
    }
  }, [
    operator?.value,
    navigate,
    location.pathname,
    createQueryString,
    operator,
  ]);

  return (
    <div className="flex items-center space-x-2">
      {i === 0 ? (
        <div>Where</div>
      ) : i === 1 ? (
        <Select
          value={operator?.value}
          onValueChange={(value) =>
            setOperator(
              dataTableConfig.logicalOperators.find((o) => o.value === value)
            )
          }
        >
          <SelectTrigger className="h-8 w-fit text-xs">
            <SelectValue placeholder={operator?.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dataTableConfig.logicalOperators.map((operator) => (
                <SelectItem
                  key={operator.value}
                  value={operator.value}
                  className="text-xs"
                >
                  {operator.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <div key={operator?.value}>{operator?.label}</div>
      )}

      <Select
        value={String(selectedOption?.value)}
        onValueChange={(value) => {
          setSelectedOption(
            allOptions.find((option) => option.value === value)
          );
          setSelectedOptions((prev) =>
            prev.map((item) => {
              if (item.id === option.id) {
                return {
                  ...item,
                  value: value as keyof TData,
                };
              }
              return item;
            })
          );
        }}
      >
        <SelectTrigger className="h-8 w-full text-xs capitalize">
          <SelectValue placeholder={selectedOption?.label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {allOptions.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
                className="text-xs capitalize"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {!isRange && (
        <Select
          value={filterVariety}
          onValueChange={(value) => setFilterVariety(value)}
        >
          <SelectTrigger className="h-8 w-full truncate px-2 py-0.5 hover:bg-muted/50">
            <SelectValue placeholder={filterVarieties[0]} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filterVarieties.map((variety) => (
                <SelectItem key={variety} value={variety}>
                  {variety}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {selectedOption?.options.length ? (
        table.getColumn(selectedOption.value ? String(option.value) : '') && (
          <DataTableFacetedFilter
            key={selectedOption.id}
            column={table.getColumn(
              selectedOption.value ? String(selectedOption.value) : ''
            )}
            title={selectedOption.label}
            options={selectedOption.options}
          />
        )
      ) : selectedOption?.numberOptition ? (
        isRange ? (
          <div className="w-64">
            <Slider
              keyValue={selectedOption.numberOptition.key ?? ' value'}
              defaultValue={[
                selectedOption.numberOptition.rangeMin ?? 0,
                selectedOption.numberOptition.rangeMax ?? 100,
              ]}
              max={selectedOption.numberOptition.rangeMax ?? 100}
              step={1}
              value={value ? value.split('-').map((e) => Number(e)) : undefined}
              onValueChange={(values) => handleNumberChange(values.join('-'))}
            />
          </div>
        ) : selectedOption.numberOptition.maxNumber ? (
          <Select value={value} onValueChange={handleNumberChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={'Select a number of ' + selectedOption.label}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from(
                  { length: selectedOption.numberOptition.maxNumber },
                  (_, i) => i + 1
                ).map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleNumberChange(e.target.value)}
            placeholder={selectedOption.label || ''}
            autoFocus
          />
        )
      ) : (
        <Input
          placeholder="Type here..."
          className="h-8"
          value={value}
          onChange={(event) => handleNumberChange(event.target.value)}
          autoFocus
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setSelectedOptions((prev) =>
                prev.filter((item) => item.id !== option.id)
              );
            }}
          >
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Remove
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (!selectedOption) return;
              //@ts-ignore
              setSelectedOptions((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  label: selectedOption.label,
                  value: selectedOption.value,
                  options: selectedOption.options ?? [],
                  isMulti: true,
                },
              ]);
            }}
          >
            <CopyIcon className="mr-2 size-4" aria-hidden="true" />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
