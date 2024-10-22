'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CloudUpload, Paperclip } from 'lucide-react';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload';
import { queryKey, useCreatePerson } from '@/services/person';
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  CNIMan: z.string().regex(/^[a-zA-Z]{1,2}\d{5,7}$/, {
    message:
      'Le CNI doit commencer par une ou deux lettres suivies de 5 à 7 chiffres.',
  }),
  CNIWoman: z.string().regex(/^[a-zA-Z]{1,2}\d{5,7}$/, {
    message:
      'Le CNI doit commencer par une ou deux lettres suivies de 5 à 7 chiffres.',
  }),
  firstName: z.string(),
  lastName: z.string(),
  docs: z.array(z.string()).optional(),
});

export default function CreatePerson({ onSuccess }: { onSuccess: () => void }) {
  const [files, setFiles] = useState<File[] | null>([]);
  const { mutate } = useCreatePerson();

  const queryClient = useQueryClient();

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      mutate(
        { ...values, docs: files },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey.getPeople });
            toast.success('Formulaire soumis avec succès !');
            onSuccess();
          },
        }
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="CNIMan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carte d'identité nationale (Homme)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Veuillez entrer la carte d'identité nationale de l'homme"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ce champ est pour la carte d'identité nationale de l'homme.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="CNIWoman"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carte d'identité nationale (Femme)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Veuillez entrer la carte d'identité nationale de la femme"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ce champ est pour la carte d'identité nationale de la femme.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Veuillez entrer le prénom"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ce champ est pour le prénom de la personne.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de famille</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Veuillez entrer le nom de famille"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ce champ est pour le nom de famille de la personne.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="docs"
          render={({}) => (
            <FormItem>
              <FormLabel>Documents</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Cliquez pour télécharger
                        </span>
                        &nbsp; ou faites glisser et déposez
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Formats acceptés : SVG, PNG, JPG ou GIF
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormDescription>Téléchargez plusieurs fichiers.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Envoyer</Button>
      </form>
    </Form>
  );
}
