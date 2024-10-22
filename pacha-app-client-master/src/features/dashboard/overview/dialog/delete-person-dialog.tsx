import * as React from 'react';
import { ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useQueryClient } from '@tanstack/react-query';
import { queryKey, PersonType, useDeletePersons } from '@/services/person';

interface DeletePersonsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  persons: Row<PersonType>['original'][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeletePersonsDialog({
  persons,
  showTrigger = true,
  onSuccess,
  ...props
}: DeletePersonsDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const queryClient = useQueryClient();
  const { mutate } = useDeletePersons();

  const handleDelete = async () => {
    // await deletePersons({
    //   ids: persons.map((person) => person.id),
    // });

    mutate(
      persons.map((p) => p.id!),
      {
        onSuccess: () => {
          props.onOpenChange?.(false);
          queryClient.invalidateQueries({
            queryKey: queryKey.getPeople,
          });
          toast.success('Personne(s) supprimée(s) avec succès.');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Supprimer ({persons.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Supprimer {persons.length > 1 ? 'les personnes' : 'la personne'}
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer {persons.length}{' '}
            {persons.length > 1 ? 'personnes' : 'personne'} ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            aria-label="Supprimer les lignes sélectionnées"
            variant="destructive"
            onClick={() => {
              startDeleteTransition(() => {
                handleDelete();
              });
            }}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
