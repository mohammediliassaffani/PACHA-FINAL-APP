// import * as React from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { PersonType } from '@/services/person';

// interface UpdatePersonModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   person: PersonType; // Assuming PersonType is defined elsewhere
//   onUpdate: (id: string, updatedData: Partial<PersonType>) => Promise<void>;
// }

// const UpdatePersonModal: React.FC<UpdatePersonModalProps> = ({
//   open,
//   onOpenChange,
//   person,
//   onUpdate,
// }) => {
//   // Local state for form fields
//   const [firstName, setFirstName] = React.useState<string>(person.firstName);
//   const [lastName, setLastName] = React.useState<string>(person.lastName);
//   const [CNIMan, setCNIMan] = React.useState<string>(person.CNIMan);
//   const [CNIWoman, setCNIWoman] = React.useState<string>(person.CNIWoman);
//   const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsUpdating(true);
//     const updatedData: Partial<PersonType> = { firstName, lastName, CNIMan, CNIWoman };
    
//     try {
//       await onUpdate(person.id, updatedData);
//       onOpenChange(false); // Close the modal after updating
//     } catch (error) {
//       console.error("Update failed:", error);
//       // Optionally handle the error (e.g., show a toast notification)
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={() => onOpenChange(false)}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Update Person</DialogTitle>
//           <DialogDescription>
//             Update the details of the selected person.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">First Name</label>
//             <input
//               type="text"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               className="mt-1 block w-full border rounded p-2"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Last Name</label>
//             <input
//               type="text"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               className="mt-1 block w-full border rounded p-2"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">CNI (Homme)</label>
//             <input
//               type="text"
//               value={CNIMan}
//               onChange={(e) => setCNIMan(e.target.value)}
//               className="mt-1 block w-full border rounded p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">CNI (Femme)</label>
//             <input
//               type="text"
//               value={CNIWoman}
//               onChange={(e) => setCNIWoman(e.target.value)}
//               className="mt-1 block w-full border rounded p-2"
//             />
//           </div>
//           <DialogFooter className="gap-2 sm:space-x-0">
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button
//               type="submit"
//               variant="primary"
//               disabled={isUpdating}
//             >
//               {isUpdating ? 'Updating...' : 'Update'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UpdatePersonModal;