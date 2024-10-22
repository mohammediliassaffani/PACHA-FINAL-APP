import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import queryString from 'query-string';

import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLocation, useNavigate } from 'react-router-dom';

interface DateRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  dateRange?: DateRange;

  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  dayCount?: number;

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string;

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps['variant'], 'destructive' | 'link'>;

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps['size'], 'icon'>;

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string;
  /**
   * The names of the query parameters for the date range.
   * @default { from: 'from', to: 'to' }
   * @type { from: string; to: string }
   */
  queryNames?: { from: string; to: string };
}

export const DateRangePicker = React.forwardRef<
  {
    clear: () => void;
  },
  DateRangePickerProps
>(
  (
    {
      dateRange,
      dayCount,
      placeholder = 'Pick a date',
      triggerVariant = 'outline',
      triggerSize = 'default',
      triggerClassName,
      className,
      queryNames,
      ...props
    },
    ref
  ) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [date, setDate] = React.useState<DateRange | undefined>(() => {
      const params = queryString.parse(location.search);
      const fromParam = params[queryNames?.from ?? ''] as string;
      const toParam = params[queryNames?.to ?? ''] as string;

      let fromDay: Date | undefined;
      let toDay: Date | undefined;

      if (dateRange) {
        fromDay = dateRange.from;
        toDay = dateRange.to;
      } else if (dayCount) {
        toDay = new Date();
        fromDay = addDays(toDay, -dayCount);
      }

      return {
        from: fromParam ? new Date(fromParam) : fromDay,
        to: toParam ? new Date(toParam) : toDay,
      };
    });

    // Update query string

    // Update query string
    React.useEffect(() => {
      const params = queryString.parse(location.search);
      if (date?.from) {
        params[queryNames?.from ?? ''] = format(date.from, 'yyyy-MM-dd');
      } else {
        delete params[queryNames?.from ?? ''];
      }

      if (date?.to) {
        params[queryNames?.to ?? ''] = format(date.to, 'yyyy-MM-dd');
      } else {
        delete params[queryNames?.to ?? ''];
      }

      navigate({
        pathname: location.pathname,
        search: queryString.stringify(params),
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date?.from, date?.to]);

    const handleClear = () => {
      setDate(undefined);
      const params = queryString.parse(location.search);
      delete params[queryNames?.from ?? ''];
      delete params[queryNames?.to ?? ''];

      navigate({
        pathname: location.pathname,
        search: queryString.stringify(params),
      });
    };

    React.useImperativeHandle(ref, () => ({
      clear: handleClear,
    }));

    return (
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={triggerVariant}
              size={triggerSize}
              className={cn(
                'w-full justify-start truncate text-left font-normal',
                !date && 'text-muted-foreground',
                triggerClassName
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={cn('w-auto p-0', className)} {...props}>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
DateRangePicker.displayName = 'DateRangePicker';
