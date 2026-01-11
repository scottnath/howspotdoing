import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Answer can be YES, NO, N/A, MULTIPLE, FUTURE_DATE, MIXED, MULTI-STATE,
// a date string, empty string, null, or other text
const answerSchema = z.union([
  z.enum([
    'YES',
    'NO',
    'N/A',
    'MULTIPLE',
    'FUTURE_DATE',
    'MIXED',
    'MULTI-STATE',
  ]),
  z.string(),
  z.null(),
]);

// Validation can be various status strings
const validationSchema = z
  .union([
    z.enum([
      'VERIFIED',
      'QUOTE_CORRECTED',
      'QUOTE_NOT_FOUND',
      'no_data_provided',
      'URL_INACCESSIBLE',
      'ANSWER_INCORRECT',
    ]),
    z.string(),
  ])
  .optional();

const resultSchema = z.object({
  answer: answerSchema,
  summary: z.string(),
  gov_quote: z.string().optional(),
  url: z.string().optional(),
  validation: validationSchema,
  validation_notes: z.string().optional(),
  question: z.string(),
});

const answersSchema = z.object({
  RECREATIONAL: answerSchema,
  RECREATIONAL_STORE: answerSchema,
  RECREATIONAL_GROW: answerSchema,
  RECREATIONAL_PUBLIC: answerSchema,
  MEDICAL: answerSchema,
  MEDICAL_STORE: answerSchema,
  MEDICAL_GROW: answerSchema,
});

/**
 * Calculates the legality rating of a location based on its answers.
 */
export const calculateLegality = (
  answers: z.infer<typeof answersSchema>
): number => {
  let rating = 0;
  if (answers.RECREATIONAL?.toString().toLowerCase() === 'yes') {
    rating = 80;
    if (answers.RECREATIONAL_STORE?.toString().toLowerCase() === 'yes') {
      rating += 10;
    }
    if (answers.RECREATIONAL_GROW?.toString().toLowerCase() === 'yes') {
      rating += 10;
    }
  } else if (answers.MEDICAL?.toString().toLowerCase() === 'yes') {
    rating = 10;
    if (answers.MEDICAL_STORE?.toString().toLowerCase() === 'yes') {
      rating += 10;
    }
    if (answers.MEDICAL_GROW?.toString().toLowerCase() === 'yes') {
      rating += 10;
    }
  }
  return rating;
};

const locationsCollection = defineCollection({
  loader: glob({ pattern: 'hpd-*.json', base: './src/content/locations' }),
  schema: z
    .object({
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
    })
    .transform((data) => {
      const legality = calculateLegality(data.answers);
      return {
        ...data,
        title: `How's Pot Doing in ${data.location}?`,
        legality,
        answer: `Cannabis is ${legality}% legal in ${data.location}`,
      };
    }),
});

export const collections = {
  locations: locationsCollection,
};
