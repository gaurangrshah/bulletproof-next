import Link from 'next/link'
import Theme from '../components/Theme'
import ms from 'ms'
import matter from 'gray-matter'
import { getPostList, getPageList } from '../lib/data'

export default function Home({ postList, pageList }) {
  console.log("🚀 ~ file: index.js ~ line 7 ~ Home ~ pageList", pageList[0])
  return (
    <Theme>
      <div className='post-list'>
        {postList.map((post) => (
          <div key={post.slug} className='post-link'>
            <Link href='/post/[slug]' as={`/post/${post.slug}`}>
              <a>
                <div className='time'>
                  {ms(Date.now() - post.createdAt, { long: true })} ago
                </div>
                <div className='title'>{post.title}</div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </Theme>
  );
}

export async function getStaticProps () {
  const postList = await getPostList()
  const pageList = await getPageList()

  return {
    props: {
      postList,
      pageList,
    },
    revalidate: 2,
  };
}
