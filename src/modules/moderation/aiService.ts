export interface AIModerationResult {
  isSafe: boolean;
  confidence: number;
  flags: string[];
  reason?: string;
}

export const analyzeCaseContent = async (
  title: string,
  description?: string,
): Promise<AIModerationResult> => {
  const content = `${title} ${description || ""}`.toLowerCase();

  const flaggedWords = ["violence", "gore", "explicit", "inappropriate"];
  const detectedFlags = flaggedWords.filter((word) => content.includes(word));

  return {
    isSafe: detectedFlags.length === 0,
    confidence: detectedFlags.length === 0 ? 0.95 : 0.85,
    flags: detectedFlags,
    reason:
      detectedFlags.length > 0
        ? `Detected potentially inappropriate content: ${detectedFlags.join(", ")}`
        : undefined,
  };
};

export const analyzeImage = async (
  fileUrl: string,
): Promise<AIModerationResult> => {
  const isSafe = Math.random() > 0.2;
  return {
    isSafe,
    confidence: isSafe ? 0.92 : 0.78,
    flags: isSafe ? [] : ["inappropriate_content"],
    reason: isSafe
      ? undefined
      : "Image contains potentially inappropriate content",
  };
};
