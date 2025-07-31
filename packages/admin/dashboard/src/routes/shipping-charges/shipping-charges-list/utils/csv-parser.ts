interface CsvParserOptions {
  requiredColumns?: string[]
  validateColumns?: boolean
}

export const convertCsvToJson = <T extends Record<string, string>>(
  csvText: string,
  options: CsvParserOptions = {}
): Promise<T[]> => {
  const { requiredColumns = [], validateColumns = false } = options

  return new Promise((resolve, reject) => {
    try {
      const lines = csvText.trim().split('\n').filter(line => line.trim())

      if (lines.length < 2) {
        reject(new Error('CSV must have header and data rows'))
        return
      }

      const headers = parseCSVLine(lines[0])

      // Validate required columns if specified
      if (validateColumns && requiredColumns.length > 0) {
        const normalizedHeaders = headers.map(h => h.toLowerCase().trim())
        const normalizedRequired = requiredColumns.map(col => col.toLowerCase().trim())

        const missingColumns = normalizedRequired.filter(col =>
          !normalizedHeaders.includes(col)
        )

        if (missingColumns.length > 0) {
          reject(new Error(`Missing required columns: ${missingColumns.join(', ')}`))
          return
        }
      }

      const results: T[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])

        // Skip rows with incorrect column count
        if (values.length !== headers.length) {
          continue
        }

        const row: Record<string, string> = {}
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || ''
        })

        // Only include rows with at least one non-empty value
        if (Object.values(row).some(value => value !== '')) {
          results.push(row as T)
        }
      }

      if (results.length === 0) {
        reject(new Error('No valid data rows found'))
      } else {
        resolve(results)
      }
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Failed to parse CSV'))
    }
  })
}

const parseCSVLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

// Constants for shipping charges
export const SHIPPING_CHARGE_COLUMNS = [
  "Service Category",
  "Weight Slab",
  "Within City",
  "Within State",
  "Metro",
  "Rest of India"
]

// Helper function for shipping charges
export const parseShippingChargesCsv = <T extends Record<string, string>>(
  csvText: string
): Promise<T[]> => {
  return convertCsvToJson<T>(csvText, {
    requiredColumns: SHIPPING_CHARGE_COLUMNS,
    validateColumns: true
  })
} 