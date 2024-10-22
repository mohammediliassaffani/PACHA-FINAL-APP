/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { NumberOptions } from '@/common/types';

interface NumberFilterProps {
  column: any;
  numberOptition?: NumberOptions;
  placeholder?: string;
}

const NumberFilter: React.FC<NumberFilterProps> = ({
  column,
  numberOptition,
  placeholder,
}) => {
  const [value, setValue] = React.useState<string>(
    (column.getFilterValue() as string) ?? ''
  );

  const handleSelectChange = (newValue: string) => {
    setValue(newValue);
    column.setFilterValue(newValue);
  };

  return numberOptition?.maxNumber ? (
    <Select value={value} onValueChange={handleSelectChange}>
      <SelectTrigger className="h-8 w-32 text-xs">
        <SelectValue placeholder="Select number" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Array.from({ length: numberOptition.maxNumber + 1 }, (_, i) => (
            <SelectItem key={i} value={String(i)}>
              {i}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ) : (
    <Input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        column.setFilterValue(e.target.value);
      }}
      className="h-8 w-40 lg:w-64"
    />
  );
};

export default NumberFilter;
