const EXPECTED_COLUMNS = ["Service Category", "Weight Slab", "Within City", "Within State", "Metro", "Rest of India"]

export const convertCsvToJson = <T extends Record<string, string>>(csvText: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    try {
      const lines = csvText.trim().split('\n')
      if (lines.length < 2) {
        reject(new Error('CSV must have header and data rows'))
        return
      }

      const headers = parseCSVLine(lines[0])
      if (headers.length !== EXPECTED_COLUMNS.length) {
        reject(new Error(`Wrong CSV format. Expected columns: ${EXPECTED_COLUMNS.join(', ')}`))
        return
      }

      const results: T[] = []
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line) {
          const values = parseCSVLine(line)
          const obj: Record<string, string> = {}
          headers.forEach((header, index) => {
            obj[header] = values[index] || ''
          })
          results.push(obj as T)
        }
      }

      results.length === 0 ? reject(new Error('No data rows found')) : resolve(results)
    } catch (error) {
      reject(error)
    }
  })
}

const parseCSVLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i += 2
      } else {
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }

  result.push(current.trim())
  return result
} 