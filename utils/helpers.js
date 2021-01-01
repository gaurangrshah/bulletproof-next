import { compiler } from "markdown-to-jsx";

export function extractImages(markdown) {
  const images = [];

  compiler(markdown, {
    createElement(type, props) {
      if (type === "img") {
        images.push(props.src);
        return true;
      }

      if (type === "Youtube") {
        images.push(
          `https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`
        );
        return true;
      }
    },
  });

  return images[0] || null;
}


export function groupByBlockType(blockType, sections) {
  let groupedSections = sections.filter(
    (section) => section.data.block_type !== blockType
  );
  groupedSections.push(
    sections.filter((section) => section.data.block_type == blockType)
  );
  return groupedSections;
}


export function getCurrentSections(page, sections) {
  const filteredSections = sections.filter(
    (section) => !section.data.pages.indexOf(page)
  );
  const pageSections = filteredSections.map((section) => {
    section.image = extractImages(section.content);
    return section;
  });

  return groupByBlockType("card", pageSections);
}


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
