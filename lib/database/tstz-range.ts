import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/pg-core';

type RangeBounds = '[]' | '()' | '[)' | '(]';

export interface TSTZRangeOptions {
  upperInclusive: boolean; // default false
  lowerInclusive: boolean; // default true
}

export interface TSTZRange {
  lower: Date; // timestamptz
  upper: Date; // timestamptz
  options: TSTZRangeOptions;
}

/**
 * Custom type for `tstzrange` (range of timestamp with time zone).
 */
export const tstzrange = customType<{
  data: string | null; // serialized DB value (e.g. "[2025-08-24 22:00:00+00,2025-08-25 22:00:00+00)")
  driverData: string; // what the driver sends
}>({
  dataType() {
    return 'tstzrange';
  },
});

/**
 * Helper to define a tstzrange column generated from two timestamptz columns.
 * Default bounds are half-open '[)' (inclusive start, exclusive end).
 */
export function generatedTSTZRangeColumn(colName: string, lowerCol = 'start_date', upperCol = 'end_date', options: TSTZRangeOptions = { upperInclusive: false, lowerInclusive: true }) {
  const bounds: RangeBounds = `${options.lowerInclusive ? '[' : '('}${options.upperInclusive ? ']' : ')'}` as RangeBounds;

  return tstzrange(colName)
    .generatedAlwaysAs(sql`tstzrange(${sql.identifier(lowerCol)}, ${sql.identifier(upperCol)}, ${sql.raw(`'${bounds}'`)})`)
    .notNull();
}
