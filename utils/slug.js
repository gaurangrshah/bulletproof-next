export function parseSlug(slug) {
  const [year, month, day, ...titleParts] = slug.split("-");
  let title = titleParts
    .map((w) => {
      if (w.length < 4) {
        return w;
      }
      return `${w[0].toUpperCase()}${w.substr(1)}`;
    })
    .join(" ");

  if (!title) {
    title = slug;
  }
  const createdAt = new Date(`${year}-${month}-${day}`).getTime();
  return {
    title,
    createdAt,
  };
}
