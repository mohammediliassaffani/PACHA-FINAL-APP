import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DialogProps = React.ComponentProps<typeof Dialog>;
type ModelProps = {
  children: React.ReactNode;
  buttonTrigger?: React.ReactNode;
  title: string;
  description: string;
} & DialogProps;

export const Model: React.FC<ModelProps> = ({
  children,
  title,
  description,
  buttonTrigger,
  ...rest
}) => {
  return (
    <>
      <Dialog {...rest}>
        <DialogTrigger asChild>{buttonTrigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
};
