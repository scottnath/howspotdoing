import fs from 'fs-extra';
import path from 'path';
import Airtable, { type FieldSet, Record } from 'airtable';
import { config } from 'dotenv';

import { convertPastDateToYes } from '@util/data';

config();

// Setting the Airtable secret API key and the Airtable base id
// from environment variables
// const airtableToken = import.meta.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY;
// const airtableBaseId = import.meta.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE_ID;
const airtableToken = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
Airtable.configure({ apiKey: airtableToken })
const base = Airtable.base(airtableBaseId);

const contentDir = path.join(process.cwd(), 'src/content');
const usaDir = path.join(contentDir, 'locations/united-states');

export interface LocationData {
	id: string;
	location: string;
	parent: string;
	medical: string | Date;
	medStore: string | Date;
	medGrow: string | Date;
	recreational: string | Date;
	recStore: string | Date;
	recGrow: string | Date;
	researchDate: Date;
	type: string;
	legality: number;
	pubDate?: Date;
}



/**
 * Airtable sometimes returns a field as an array, so then we want to use the first item
 * @param fields
 * @param itemName
 * @returns
 */
export const nodeFieldCleanup = (fields, itemName, conv = (t:any) => t) => {
  if (Array.isArray(fields[itemName])) {
    return fields[itemName][0];
  }
  return conv(fields[itemName]);
}

/**
 * Calculates the rating of a location. Medical-only locations start at 10
 * 	because not that many folks sign up on average.
 * @see https://www.mpp.org/issues/medical-marijuana/state-by-state-medical-marijuana-laws/medical-marijuana-patient-numbers/
 * @param data LocationData
 */
export const getRating = (data: LocationData): number => {
	let rating = 0;
	if (data.recreational === 'yes') {
		rating = 80;
		if (data.recStore === 'yes') {
			rating += 10;
		}
		if (data.recGrow === 'yes') {
			rating += 10;
		}
	} else if (data.medical === 'yes') {
		rating = 10;
		if (data.medStore === 'yes') {
			rating += 10;
		}
		if (data.medGrow === 'yes') {
			rating += 10;
		}
	}
	return rating;
}

const getRatingText = (rating: number, location: string): string => {
	return `Cannabis is ${rating}% legal in ${location}`;
}

const createReportPage = (data: LocationData, report: string): string => {
	const ttl = `How's Pot Doing in ${data.location}?`;
	let page = `---\n`;
	page += `title: "${ttl}"\n`;
	for(const [key, value] of Object.entries(data)) {
		if (key === 'researchDate') page += `pubDate: ${value}\n`
		page += `${key}: ${value}\n`;
	}
	page += `---\n\n`;
	page += `# ${ttl}\n\n`;
	page += `<p class="howsit">${getRatingText(data.legality, data.location)}</p>\n\n`;
	page += `${report}`;
	return page;
}

/**
 * Gets locations from airtable
 */
export async function getLocations() {
	const arr = [];
  const locations = await base('Locations').select({
    filterByFormula: '({usa} = "1")',
  }).all()
	const meow = {};
	locations.forEach((location: Record<FieldSet>) => {
		const data: LocationData = {
			id: location.id,
			location: nodeFieldCleanup(location.fields, 'Location'),
			parent: nodeFieldCleanup(location.fields, 'Location (from Parent)'),
			medical: nodeFieldCleanup(location.fields, 'Medical', convertPastDateToYes),
			medStore: nodeFieldCleanup(location.fields, 'MedStore', convertPastDateToYes),
			medGrow: nodeFieldCleanup(location.fields, 'MedGrow', convertPastDateToYes),
			recreational: nodeFieldCleanup(location.fields, 'Recreational', convertPastDateToYes),
			recStore: nodeFieldCleanup(location.fields, 'RecStore', convertPastDateToYes),
			recGrow: nodeFieldCleanup(location.fields, 'RecGrow', convertPastDateToYes),
			researchDate: nodeFieldCleanup(location.fields, 'ResearchDate'),
			type: nodeFieldCleanup(location.fields, 'Type'),
			legality: 0,
		}
		data.legality = getRating(data);
		const page = createReportPage(data, nodeFieldCleanup(location.fields, 'Report'));
		meow[data.location] = location.fields['Reports']
		const machine = data.location.toLowerCase().replace(/\s/g, '-').replace(/\./g,'');
		// @todo - automated way to skip some locations?
		if (machine === 'washington-dc') return;
		if (machine === 'new-york') return;
		// write markdown page
		fs.outputFileSync(path.join(usaDir, machine, 'index.md'), page);
		// add to array
		arr.push(data);
	})
	console.log(JSON.stringify(meow, null, 2))
}
getLocations();
