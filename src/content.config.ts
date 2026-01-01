import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const validationEnum = z.enum(['VERIFIED', 'QUOTE_CORRECTED', 'QUOTE_NOT_FOUND']);
const answerEnum = z.enum(['YES', 'NO', 'N/A']);

const resultSchema = z.object({
  answer: answerEnum,
  summary: z.string(),
  gov_quote: z.string().optional(),
  url: z.string().optional(),
  validation: validationEnum.optional(),
  validation_notes: z.string().optional(),
  question: z.string(),
});

const answersSchema = z.object({
  RECREATIONAL: answerEnum,
  RECREATIONAL_STORE: answerEnum,
  RECREATIONAL_GROW: answerEnum,
  RECREATIONAL_PUBLIC: answerEnum,
  MEDICAL: answerEnum,
  MEDICAL_STORE: answerEnum,
  MEDICAL_GROW: answerEnum,
});

const locationsCollection = defineCollection({
  loader: glob({ pattern: 'hpd-*.json', base: './src/content/locations' }),
  schema: z.object({
    location: z.string(),
    datetime: z.string(),
    results: z.object({
      RECREATIONAL: resultSchema,
      RECREATIONAL_STORE: resultSchema,
      RECREATIONAL_GROW: resultSchema,
      RECREATIONAL_PUBLIC: resultSchema,
      MEDICAL: resultSchema,
      MEDICAL_STORE: resultSchema,
      MEDICAL_GROW: resultSchema,
    }),
    answers: answersSchema,
  }),
});

export const collections = {
  locations: locationsCollection,
};
