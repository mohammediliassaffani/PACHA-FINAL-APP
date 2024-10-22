import { z } from 'zod';
import { client } from '../common';
import { personSchema, PersonType } from './schema';

export const getPeople = async (query: any) => {
  const { firstName, ...rest } = query;
  const res = await client.get<{ persons: PersonType[]; totalPages: number }>(
    'person',
    { params: { ...rest, search: firstName } }
  );

  const arrayOfPerson = z.array(personSchema).parse(res.data.persons);
  return { people: arrayOfPerson, totalPages: res.data.totalPages };
};
export const createPerson = async (
  data: Omit<PersonType, 'docs'> & { docs: File[] | null }
): Promise<void> => {
  const formData = new FormData();

  // Append non-file fields to the form data
  Object.keys(data).forEach((key) => {
    if (key !== 'docs') {
      formData.append(key, (data as any)[key]);
    }
  });

  // Append files (docs) to the form data if they exist
  if (data.docs) {
    data.docs.forEach((file) => {
      formData.append('docs', file);
    });
  }

  // Make the POST request with form data
  await client.post('person/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteMany = async (ids: number[]) => {
  await client.delete('person/delete-many', { data: { ids } });
};
