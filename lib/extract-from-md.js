import { compiler } from "markdown-to-jsx";

export function extractLinks(markdown) {
  const links = [];

  compiler(markdown, {
    createElement(type, props) {
      if (type === "a") {
        links.push(props.href);
        return
      }
    },
  });

  return links[0] || null;
}


export function extractImages(markdown) {
    const images = []

    compiler(markdown, {
        createElement(type, props) {
            if (type === 'img') {
                images.push(props.src)
                return
            }

            if (type === 'Youtube') {
                images.push(`https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`)
            }
        }
    })

    return images[0] || null;
}
