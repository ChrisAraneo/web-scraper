import * as fs from 'fs';

export async function writeFile(
  data: any[],
  filepath: string,
): Promise<boolean> {
  const content = data.map((item) => JSON.stringify(item)).join('\n');

  try {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Saved ${data.length} results to ${filepath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving file ${filepath}:`, error);
    return false;
  }
}
