import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import CreatePerson from '../forms/create-person-form';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreatePersonSheetProps
  extends React.ComponentPropsWithoutRef<typeof Sheet> {
  showTrigger?: boolean;
  onSuccess: () => void;
}

export function CreatePersonSheet({
  showTrigger = true,
  onSuccess,
  ...props
}: CreatePersonSheetProps) {
  return (
    <Sheet {...props}>
      {showTrigger ? (
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            Ajouter une nouvelle personne
          </Button>
        </SheetTrigger>
      ) : null}
      <SheetContent className="md:w-[800px] w-full sm:max-w-full p-0 ">
        <ScrollArea className="h-full overflow-hidden p-5 rounded-xl">
          <SheetHeader>
            <SheetTitle>Créer une nouvelle personne</SheetTitle>
            <SheetDescription>
              Veuillez remplir les détails ci-dessous pour ajouter une nouvelle
              personne. Assurez-vous que tous les champs obligatoires sont
              remplis.
            </SheetDescription>
          </SheetHeader>
          <CreatePerson onSuccess={onSuccess} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
