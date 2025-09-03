import JSSoup from 'jssoup';

export async function fetchDetailsPage(url: string): Promise<string[]> {
  let result: string[] = [];

  try {
    const response = await axios.get(url);
    const soup = new JSSoup(response.data);
    const items = soup.findAll('tr');
    result = items
      .filter((item) => item.attrs?.class === 'cursor-pointer')
      .map((item) => item.getText('|'))
      .filter(Boolean);
  } catch (error) {
    console.error('Error scraping website:', url);
  }

  return result;
}
