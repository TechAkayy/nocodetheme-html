import { createApp } from 'https://unpkg.com/petite-vue?module'
const state = {
  posts: [
    //    {
    //        id: 1,
    //        title: 'Hello World!',
    //        link: 'http://nocodetheme.local/hello-world/',
    //        excerpt: '<p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p>\n',
    //        tagsList: [{id: 162, name: 'Sample', link: 'http://nocodetheme.local/tag/sample/'}],
    //        featuredMedia: [{id: 181, source_url: 'http://nocodetheme.local/wp-content/uploads/2008/06/dsc20050102_192118_51.jpg'}],
    //    }
  ],
  async fetchData() {
    const res = await fetch(
      'http://nocodetheme.local/wp-json/wp/v2/posts/?_fields=author,id,excerpt,title,link,tags,featured_media',
    )
    const postsRaw = await res.json()
    postsRaw.forEach(
      async ({ id, title, link, excerpt, tags, featured_media }) => {
        const tagsList = await this.fetchTags(tags)
        const featuredMedia = await this.fetchFeaturedMedia(featured_media)
        this.posts.push({
          id,
          title: title.rendered,
          link,
          excerpt: excerpt.rendered,
          tagsList,
          featuredMedia,
        })
      },
    )
    setTimeout(() => console.log(this.posts), 2000)
  },
  async fetchTags(ids) {
    const tagsList = []
    if (ids.length) {
      try {
        const res = await fetch(
          `http://nocodetheme.local/wp-json/wp/v2/tags?include=${ids}`,
        )
        const { id, name, link } = await res.json()
        tagsList.push({ id, name, link })
      } catch (err) {
        console.log(err)
      }
    }
    return tagsList.length
      ? tagsList
      : [
          {
            id: 162,
            name: 'Posts',
            link: 'http://nocodetheme.local/tag/sample/',
          },
        ]
  },
  async fetchFeaturedMedia(featured_media) {
    if (featured_media) {
      try {
        const res = await fetch(
          `http://nocodetheme.local/wp-json/wp/v2/media/${featured_media}`,
        )
        const { id, source_url } = await res.json()
        console.log(source_url)
        return {
          id,
          source_url,
        }
      } catch (err) {
        console.log(err)
      }
    }
    return {
      id: 181,
      source_url:
        'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDd8fG9mZmljZXxlbnwwfHx8fDE3MDY3NDg2NzZ8MA&ixlib=rb-4.0.3&q=80&w=1080',
    }
  },
}
createApp(state).mount()
