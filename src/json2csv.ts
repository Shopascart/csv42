import { getFieldsFromJson } from './fields.js'
import { createFormatValue } from './value.js'
import { CsvOptions, NestedObject } from './types.js'
import { validateDelimiter, validateEOL } from './validate.js'

export function json2csv(json: NestedObject[], options?: CsvOptions): string {
  const header = options?.header !== false // true when not specified
  const delimiter = validateDelimiter(options?.delimiter || ',')
  const eol = validateEOL(options?.eol || '\r\n')
  const fields = options?.fields
    ? Array.isArray(options?.fields)
      ? options?.fields
      : options?.fields(json)
    : getFieldsFromJson(json)
  const formatValue = options?.formatValue || createFormatValue(delimiter)

  let output = ''

  if (header) {
    output += headerToCsv() + eol
  }

  for (let i = 0; i < json.length; i++) {
    output += rowToCsv(json[i]) + eol
  }

  return output

  function headerToCsv(): string {
    return fields
      .map((field) => field.name)
      .map(formatValue)
      .join(delimiter)
  }

  function rowToCsv(item: NestedObject): string {
    return fields
      .map((field) => field.getValue(item))
      .map(formatValue)
      .join(delimiter)
  }
}
