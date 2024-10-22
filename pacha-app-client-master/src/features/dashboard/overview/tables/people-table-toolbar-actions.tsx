import { PersonType } from '@/services/person';
import { type Table } from '@tanstack/react-table';

import { useState } from 'react';
import { CreatePersonSheet } from '../sheet/create-person-sheet';
import { DeletePersonsDialog } from '../dialog/delete-person-dialog';

interface PeopleTableToolbarActionsProps {
  table: Table<PersonType>;
}

export function PeopleTableToolbarActions({
  table,
}: PeopleTableToolbarActionsProps) {
  const [createUser, setCreateUser] = useState<boolean>(false);
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeletePersonsDialog
          persons={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      {/* <CreateContactSheet /> */}

      <CreatePersonSheet
        open={createUser}
        onSuccess={() => setCreateUser(false)}
        onOpenChange={setCreateUser}
      />
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
