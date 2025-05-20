import { read, utils, WorkBook } from 'xlsx';
import { DisasterEvent } from '../types/disaster';
import { transformEmdatRecord } from './emdat';
import { parse, isValid } from 'date-fns';

function validateWorkbook(workbook: WorkBook): void {
  if (!workbook.SheetNames.length) {
    throw new Error('No sheets found in the XLSX file');
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!worksheet) {
    throw new Error('First sheet is empty');
  }

  const headers = utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
  
  if (!headers || !headers.length) {
    throw new Error('No headers found in the sheet');
  }

  // Case-insensitive header matching
  const normalizedHeaders = headers.map(h => h?.toLowerCase().trim());
  const requiredColumns = [
    'start year',
    'start month',
    'start day',
    'disaster type',
    'country'
  ];

  const missingColumns = requiredColumns.filter(col => 
    !normalizedHeaders.some(header => header?.includes(col))
  );

  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }
}

function constructDate(year?: string | number, month?: string | number, day?: string | number): string | null {
  if (!year) return null;

  const y = parseInt(year.toString());
  const m = month ? parseInt(month.toString()) - 1 : 0; // JS months are 0-based
  const d = day ? parseInt(day.toString()) : 1;

  const date = new Date(y, m, d);
  return isValid(date) ? date.toISOString() : null;
}

export async function parseEmdatXlsx(data: ArrayBuffer): Promise<DisasterEvent[]> {
  try {
    console.log('Starting XLSX parsing...');
    
    const workbook = read(data, { 
      type: 'array',
      cellDates: false, // We'll handle date parsing manually
      raw: true
    });

    validateWorkbook(workbook);
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json<{ [key: string]: any }>(worksheet, {
      raw: true,
      defval: '',
    });

    console.log(`Processing ${jsonData.length} records from XLSX`);

    const validRecords = jsonData
      .map((record, index) => {
        try {
          // Clean and normalize the record data
          const cleanRecord = Object.fromEntries(
            Object.entries(record).map(([key, value]) => [
              key.trim(),
              typeof value === 'string' ? value.trim() : value
            ])
          );

          // Construct start date from components
          const startDate = constructDate(
            cleanRecord['Start Year'],
            cleanRecord['Start Month'],
            cleanRecord['Start Day']
          );

          if (!startDate) {
            console.warn(`Invalid start date for record ${index}:`, {
              year: cleanRecord['Start Year'],
              month: cleanRecord['Start Month'],
              day: cleanRecord['Start Day']
            });
            return null;
          }

          // Construct end date from components if available
          const endDate = constructDate(
            cleanRecord['End Year'],
            cleanRecord['End Month'],
            cleanRecord['End Day']
          );

          // Add constructed dates to the record
          const recordWithDates = {
            ...cleanRecord,
            'Start Date': startDate,
            'End Date': endDate
          };

          const transformedRecord = transformEmdatRecord(recordWithDates, index);
          if (!transformedRecord) {
            console.warn(`Invalid record at index ${index}:`, cleanRecord);
            return null;
          }
          return transformedRecord;
        } catch (err) {
          console.error(`Error transforming record at index ${index}:`, err);
          return null;
        }
      })
      .filter((record): record is DisasterEvent => 
        record !== null && 
        record.location.lat !== 0 && 
        record.location.lng !== 0
      );

    if (!validRecords.length) {
      throw new Error('No valid records found in the file');
    }

    console.log(`Successfully parsed ${validRecords.length} valid records`);
    return validRecords;
  } catch (err) {
    console.error('XLSX parsing error:', err);
    throw new Error(
      err instanceof Error 
        ? err.message 
        : 'Failed to parse XLSX file. Please check the format.'
    );
  }
}