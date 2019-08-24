import assert from 'assert';

export function computeNextBackoffInterval(
  initialBackoff: number,
  previousRetryCount: number,
  {
    multiplier = 1.5,
    randomizationFactor = 0.25,
    minBackoff = initialBackoff,
    maxBackoff = Infinity,
  } = {},
): number {
  assert(initialBackoff > 0, `The initial backoff interval must be positive`);
  assert(previousRetryCount >= 0, `The previous retry count must not be negative`);
  assert(multiplier >= 1, `The backoff multiplier must be greater than or equal to 1`);
  assert(
    0 <= randomizationFactor && randomizationFactor <= 1,
    `The randomization factor must be between 0 and 1, inclusive`,
  );
  assert(minBackoff >= 0, `The minimum backoff interval must be positive`);

  let nextBackoff = initialBackoff * multiplier ** previousRetryCount;
  // Apply jitter within the negative to positive range of the randomization factor
  let jitterFactor = 1 - randomizationFactor + 2 * randomizationFactor * Math.random();
  return Math.min(Math.max(nextBackoff * jitterFactor, minBackoff), maxBackoff);
}
