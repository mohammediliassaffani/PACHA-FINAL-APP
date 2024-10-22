import { DataTableSkeleton } from '@/components/data-table';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Shell } from '@/components/ui/shell';
import { PeopleTable } from '@/features/dashboard/overview/tables';
import { TableProvider } from '@/hooks';
import { useGetPeopel } from '@/services/person';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data, isLoading } = useGetPeopel({
    variables: params,
    enabled: !!params,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsInitialLoad(false);
    }
  }, [isLoading]);

  if (isInitialLoad) {
    return (
      <div className="mx-6">
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
          shrinkZero
        />
      </div>
    );
  }

  return (
    <div className="mx-6">
      <h1 className="text-3xl font-black">
        Gestion des documents des personnes
      </h1>
      <p className=" font-thin ">
        Utilisez cette page pour gérer les documents liés aux personnes.
      </p>

      <Shell className="gap-2 ">
        {/**
         * The `LeadTableProvider` is use to enable some feature flags for the `LeadTable` component.
         * Feel free to remove this, as it's not required for the `LeadTable` component to work.
         */}
        <TableProvider>
          {/**
           * The `DateRangePicker` component is used to render the date range picker UI.
           * It is used to filter the tasks based on the selected date range it was created at.
           * The business logic for filtering the tasks based on the selected date range is handled inside the component.
           */}
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
            queryNames={{ from: 'fromcreatedAt', to: 'tocreatedAt' }}
          />
          {/**
           * Passing promises and consuming them using React.use for triggering the suspense fallback.
           * @see https://react.dev/reference/react/use
           */}
          <PeopleTable people={data?.people} total={data?.totalPages ?? 2} />
        </TableProvider>
      </Shell>
    </div>
  );
};
