import { z } from 'zod';

// Define a Zod schema to validate the Person
export const personSchema = z.object({
  id: z.number().int().optional(), // id should be an integer
  firstName: z.string(), // firstName should be a string
  lastName: z.string(), // lastName should be a string
  CNIMan: z.string(), // CNIMan should be a string
  CNIWoman: z.string(), // CNIWoman should be a string
  docs: z.array(z.string().url()), // docs should be an array of valid URLs
});

export type PersonType = z.infer<typeof personSchema>;
