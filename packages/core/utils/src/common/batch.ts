/**
 * Splits an array into smaller batches of specified size
 * @param array - The array to split into batches
 * @param batchSize - The size of each batch
 * @returns An array of batches
 */
export const createBatches = <T>(array: T[], batchSize: number): T[][] => {
  const batches: T[][] = []
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize))
  }
  return batches
}

/**
 * Processes an array in batches and combines the results
 * @param array - The array to process
 * @param processBatch - Function to process each batch
 * @param batchSize - The size of each batch (default: 100)
 * @returns Combined results from all batches
 */
export const processInBatches = async <T, R>(
  array: T[],
  processBatch: (batch: T[]) => Promise<R>,
  batchSize: number = 100
): Promise<R[]> => {
  const batches = createBatches(array, batchSize)
  const results: R[] = []

  for (const batch of batches) {
    const result = await processBatch(batch)
    results.push(result)
  }

  return results
}

/**
 * Processes an array in batches with delay between batches
 * @param array - The array to process
 * @param processBatch - Function to process each batch
 * @param options - Configuration options
 * @returns Combined results from all batches
 */
export const processInBatchesWithDelay = async <T, R>(
  array: T[],
  processBatch: (batch: T[]) => Promise<R>,
  options: {
    batchSize?: number
    delayMs?: number
  } = {}
): Promise<R[]> => {
  const { batchSize = 100, delayMs = 1000 } = options
  const batches = createBatches(array, batchSize)
  const results: R[] = []

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    const result = await processBatch(batch)
    results.push(result)

    // Add delay between batches except for the last batch
    if (i < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return results
}
