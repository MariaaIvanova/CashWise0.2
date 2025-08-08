/**
 * Generates a consistent avatar with background color and letter from a name
 * @param name - The name to generate avatar from
 * @returns Object with bgColor (hex string) and letter (string)
 */
export function generateAvatar(name: string | undefined) {
  if (!name) return { bgColor: "#6B7280", letter: "U" };

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = "#" + Math.abs(hash).toString(16).substring(0, 6);
  const letter = name.charAt(0).toUpperCase();

  return { bgColor: color, letter };
}
