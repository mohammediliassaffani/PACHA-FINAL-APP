import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerWithRangeProps {
  className?: string;
  startDate?: Date;
  endDate?: Date;
  onStart?: (date: Date) => void;
  onEnd?: (date: Date) => void;
  updateEndDate?: (date: Date) => void;
}

export function DatePickerWithRange({
  className,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onStart,
  onEnd,
}: DatePickerWithRangeProps) {
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    initialStartDate
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    initialEndDate
  );

  const handleSelect = (selectedDate?: DateRange) => {
    if (selectedDate?.from && selectedDate?.to) {
      setStartDate(selectedDate?.from);
      setEndDate(selectedDate?.to);
      if (onStart) onStart(selectedDate?.from);
      if (onEnd) onEnd(selectedDate?.to);
    }
  };

  React.useEffect(() => {
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant='outline'
            className={cn(
              ' justify-start text-left font-normal',
              (!startDate || !endDate) && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {startDate && endDate ? (
              <>
                {format(startDate, 'LLL dd, y')} -{' '}
                {format(endDate, 'LLL dd, y')}
              </>
            ) : (
              <span>Pick subscription duration</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={initialStartDate}
            selected={{ from: startDate, to: endDate }}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
