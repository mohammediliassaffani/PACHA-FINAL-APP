import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PersonModalProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  showTrigger?: boolean;
  person: {
    firstName: string;
    lastName: string;
    docs: string[];
    CNIMan: string;
    CNIWoman: string;
  };
}

export default function PersonModal({
  showTrigger = true,
  person,
  ...props
}: PersonModalProps) {
  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Voir les détails
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="md:max-w-[1200px] w-full p-0">
        <ScrollArea className="h-[80vh] overflow-hidden p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle>
              Détails de la personne et numéros d&apos;identité
            </DialogTitle>
            <DialogDescription>
              Informations sur {person.firstName} {person.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            {/* Display CNIs at the top */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">CNI (Homme)</h3>
                <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md">
                  {person.CNIMan}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">CNI (Femme)</h3>
                <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md">
                  {person.CNIWoman}
                </p>
              </div>
            </div>

            {/* Show first name and last name in the middle */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Nom complet</h3>
              <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md">
                {person.firstName} {person.lastName}
              </p>
            </div>

            {/* Display Docs at the bottom */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <div className="relative w-full h-64">
                {person.docs.length > 0 ? (
                  person.docs.map((imageUrl, index) => (
                    <img
                      key={index} // Use index to avoid issues with duplicate keys
                      src={imageUrl}
                      alt={`${person.firstName} ${person.lastName}`}
                      className="object-cover rounded-lg mb-4" // Adjusted for spacing
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    Aucun document disponible.
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
