import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/pg-core';

type TSRangeBounds = '[]' | '()' | '[)' | '(]';

export interface TSRangeOptions {
  upperInclusive: boolean;
  lowerInclusive: boolean;
}
export interface TSRange {
  lower: Date;
  upper: Date;
  options: TSRangeOptions;
}

/**
 * Custom type for `tsrange` (range of timestamp without time zone).
 */
export const tsrange = customType<{
  data: string | null;
  driverData: string;
}>({
  dataType() {
    return 'tsrange';
  },
});

/**
 * Helper to define a tsrange column generated from two timestamp columns
 */
export function generatedTSRangeColumn(colName: string, lowerCol = 'start_date', upperCol = 'end_date', options: TSRangeOptions = { upperInclusive: false, lowerInclusive: true }) {
  const bounds: TSRangeBounds = `${options.lowerInclusive ? '[' : '('}${options.upperInclusive ? ']' : ')'}` as TSRangeBounds;

  return tsrange(colName)
    .generatedAlwaysAs(sql`tsrange(${sql.identifier(lowerCol)}, ${sql.identifier(upperCol)}, ${sql.raw(`'${bounds}'`)})`)
    .notNull();
}
