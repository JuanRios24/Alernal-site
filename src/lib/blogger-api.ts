const BLOG_ID = import.meta.env.VITE_BLOG_ID;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function getPosts() {
  const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.items.map((post: any) => {
      const image = (post.content.match(/<img.*?src="(.*?)"/) || [
        null,
        null,
      ])[1];
      const description =
        post.content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150) + "...";
      const slug = post.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return {
        id: post.id,
        slug,
        image,
        description,
        title: post.title,
        content: post.content,
        published: post.published,
        labels: post.labels,
        author_name: post.author.displayName,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return null;
  }

  const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${post.id}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  return data;
}
