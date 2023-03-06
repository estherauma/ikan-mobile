
export const truncateChar = (text: string, charLimit: number = 10): string => {
    if (!text || text.length <= charLimit )
    {
        return text;
    }

  const shortened = text.substring(0, charLimit) + '...';
  return shortened;
};
