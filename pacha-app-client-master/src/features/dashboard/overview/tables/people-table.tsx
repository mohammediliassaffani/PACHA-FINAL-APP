import * as React from 'react';

import { DataTableFilterField } from '@/common/types';
import {
  DataTable,
  DataTableAdvancedToolbar,
  DataTableToolbar,
} from '@/components/data-table';
import { useTable } from '@/hooks';

import { getColumns } from './people-table-columns';
import { useDataTable } from '@/hooks/use-data-table';
import { PeopleTableToolbarActions } from './people-table-toolbar-actions';
import { PeopelTableFloatingBar } from './people-table-floating-bar';
import { PersonType } from '@/services/person';

interface PeopleTableProps {
  people?: PersonType[];
  total: number;
}

export function PeopleTable({ people, total }: PeopleTableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  const { featureFlags } = useTable();

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<PersonType>[] = [
    {
      label: 'Search for CNI ( Homme )',
      value: 'CNIMan',
      placeholder: 'Rechercher par CNI (Homme).',
    },
    {
      label: 'Search for CNI ( Femme )',
      value: 'CNIWoman',
      placeholder: 'Rechercher par CNI (Femme).',
    },
    {
      label: 'Search for CNI ( Femme )',
      value: 'firstName',
      placeholder: 'Rechercher par nom ou prénom.',
    },
    // {
    //   label: 'role',
    //   value: 'role',
    //   options: usersOption.map((e) => ({
    //     label: e.label,
    //     value: e.value,
    //     withCount: false,
    //   })),
    // },
    // {
    //   label: 'verified',
    //   value: 'isVerified',
    //   options: VerifiedOptions.map((e) => ({
    //     label: e.label,
    //     value: e.value,
    //     withCount: false,
    //   })),
    // },
    // {
    //   label: 'blocked',
    //   value: 'isBlocked',
    //   options: BlockedOptions.map((e) => ({
    //     label: e.label,
    //     value: e.value,
    //     withCount: false,
    //   })),
    // },
    // {
    //   label: 'subscriptions',
    //   value: 'subscription',
    //   options: SubscriptionsOptions.map((e) => ({
    //     label: e.label,
    //     value: e.value,
    //     withCount: false,
    //   })),
    // },
  ];
  const { table } = useDataTable({
    data: people ?? [],
    columns,
    pageCount: total ?? 10,
    filterFields,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    defaultPerPage: 10,
    defaultSort: 'id.desc',
  });

  return (
    <DataTable
      table={table}
      floatingBar={
        featureFlags.includes('floatingBar') ? (
          <PeopelTableFloatingBar table={table} />
        ) : null
      }
    >
      {featureFlags.includes('advancedFilter') ? (
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <PeopleTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table} filterFields={filterFields}>
          <PeopleTableToolbarActions table={table} />
        </DataTableToolbar>
      )}
    </DataTable>
  );
}
