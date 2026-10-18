import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronDown,
  Command, Cpu, Headphones, Layers3, Mail, Menu, Moon, Search, Send,
  Share2, Sparkles, Sun, TrendingUp, X,
} from 'lucide-react'

type Story = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  read: string
  image: string
  accent: string
  body: string[]
  sourceUrl?: string
}

const sampleStories: Story[] = [
  {
    slug: 'thinking-machines-and-human-creativity',
    title: 'The best creative tools don’t think for you. They help you think bigger.',
    excerpt: 'A new generation of AI is changing the creative process—not by replacing the spark, but by giving it room to catch fire.',
    category: 'Perspectives', author: 'Maya Chen', read: '8 min read',
    image: 'photo-1518770660439-4636190af475', accent: 'violet',
    body: [
      'The interesting question about creative AI was never whether a machine could make something. It was what happens to the person making it when the tool starts offering possibilities at the speed of thought.',
      'A good creative partner does not hand you a finished idea. It gives you something to react to: a different angle, an unexpected constraint, a first draft you can push against. Used well, AI can make the blank page feel less like a wall and more like a door.',
      'That distinction matters. When people stay in the loop as editors, curators, and decision-makers, the technology becomes less of an autopilot and more of an amplifier. The important work is still human: knowing what feels true, what deserves attention, and when to begin again.',
      'The best tools will not be the ones that make us disappear from the process. They will be the ones that make the process feel more alive.',
    ],
  },
  {
    slug: 'small-models-big-potential',
    title: 'The case for smaller, more thoughtful AI',
    excerpt: 'As the industry races to build bigger models, a quieter shift is bringing intelligence closer to where we actually need it.',
    category: 'Research', author: 'Noah Williams', read: '6 min read',
    image: 'photo-1451187580459-43490279c0fa', accent: 'blue',
    body: [
      'Bigger is an easy thing to measure. Better is harder. A growing community of researchers and product teams are asking whether an efficient, focused model can be more useful than a general system that does everything adequately.',
      'Smaller systems can run closer to their users, respond more quickly, and work within tighter boundaries. Those characteristics change the design conversation: capability is no longer the only goal; control and context become part of the product.',
      'This is not an argument against ambitious research. It is a reminder that intelligence is valuable when it fits the task. In practice, the most consequential model might be the one that solves a particular problem quietly, reliably, and with fewer trade-offs.',
    ],
  },
  {
    slug: 'who-designs-ai-agents',
    title: 'Who’s responsible when an AI agent makes the call?',
    excerpt: 'Autonomous systems invite us to reconsider a very human question: how do we make accountability visible?',
    category: 'Ethics', author: 'Imani Brooks', read: '9 min read',
    image: 'photo-1485827404703-89b55fcc595e', accent: 'orange',
    body: [
      'An agent that can take action changes more than a workflow. It changes the distance between making a suggestion and making a decision. In that smaller gap, old assumptions about responsibility deserve another look.',
      'Designers can make systems easier to understand by showing the information an agent used, offering meaningful opportunities to intervene, and making uncertainty legible. These are not only safeguards; they are design decisions that help people build appropriate trust.',
      'The goal should not be to make every action frictionless. It should be to put the right friction in the right place—and ensure that someone can still answer the question, “Why did this happen?”',
    ],
  },
  {
    slug: 'the-new-shape-of-search',
    title: 'Search is becoming a conversation. That changes everything.',
    excerpt: 'When answers arrive with context instead of a list of links, the whole idea of finding information starts to shift.',
    category: 'Technology', author: 'Theo Martin', read: '5 min read',
    image: 'photo-1550745165-9bc0b252726f', accent: 'pink',
    body: [
      'For a long time, finding information meant learning how to ask the right question and scan the right results. Conversational tools are changing that habit, offering follow-up questions and stitched-together explanations instead.',
      'The interface feels more natural, but natural language does not remove the need for good judgment. Readers still need to understand where an answer came from, what might be missing, and when a convenient summary should lead to the original source.',
      'The most promising version of this shift is not an answer engine that asks for blind trust. It is a patient guide that makes exploration easier while keeping the sources within reach.',
    ],
  },
  {
    slug: 'inside-a-more-accessible-web',
    title: 'Can AI make the internet easier for everyone to use?',
    excerpt: 'Assistive technology is opening new paths through the digital world—and raising important questions about who gets to shape them.',
    category: 'People', author: 'Leila Okafor', read: '7 min read',
    image: 'photo-1498050108023-c5249f4df085', accent: 'green',
    body: [
      'Accessibility is often framed as a list of requirements to meet. But the people who rely on accessible technology are not a niche audience. They are users with diverse needs, preferences, and ways of moving through the world.',
      'AI can help create captions, describe visual content, and adapt information to different contexts. The opportunities are meaningful—but tools built without input from the communities they aim to serve can easily reproduce familiar barriers.',
      'The way forward is collaborative: build with people, make the controls understandable, and treat accessibility as a foundation for better experiences rather than an afterthought.',
    ],
  },
  {
    slug: 'climate-and-computing',
    title: 'A more honest conversation about AI and energy',
    excerpt: 'Technology’s environmental footprint deserves more than a footnote. Better measurement is a good place to start.',
    category: 'Research', author: 'Ravi Shah', read: '6 min read',
    image: 'photo-1473341304170-971dccb5ac1e', accent: 'teal',
    body: [
      'Every digital service depends on physical infrastructure. With AI, the scale and visibility of that infrastructure have become harder to ignore—and more important to understand.',
      'Useful comparisons begin with useful measurements. That means paying attention to the whole lifecycle, from training and everyday use to the energy mix and hardware involved, rather than relying on a single number that cannot explain the context.',
      'The choices that follow from better measurement are practical: use the right-sized model, reduce unnecessary computation, and make progress legible enough for others to evaluate.',
    ],
  },
  {
    slug: 'designing-for-a-human-in-the-loop',
    title: 'The human in the loop should be more than a checkbox',
    excerpt: 'Meaningful oversight means giving people the context, time, and authority to actually shape what happens next.',
    category: 'Ethics', author: 'Amara Lewis', read: '7 min read',
    image: 'photo-1522071820081-009f0129c71c', accent: 'green',
    body: [
      '“Human in the loop” has become a reassuring phrase. But a person who is rushed, kept in the dark, or unable to change an outcome is not exercising meaningful oversight.',
      'Good review starts with good conditions. People need enough context to understand a decision, enough time to consider it, and a real way to slow down or change course when something feels wrong.',
      'This is a design challenge as much as a policy one. Build for attention rather than rubber-stamping, and accountability starts to become something a team can practice—not just something a product can claim.',
    ],
  },
  {
    slug: 'what-we-mean-by-open',
    title: '“Open” AI can mean a lot of different things',
    excerpt: 'A more useful conversation starts by getting specific about what is open, who benefits, and what comes with it.',
    category: 'Technology', author: 'Elliot Park', read: '5 min read',
    image: 'photo-1451187580459-43490279c0fa', accent: 'blue',
    body: [
      'In AI, openness is not one setting. It can refer to access to a model, its weights, the training data, a development process, or the tools needed to build on top of it.',
      'Each version creates different possibilities and different obligations. What matters is whether people can see enough to evaluate the system and whether the terms of access match the promise being made.',
      'Instead of treating “open” as a simple stamp of approval, ask what is being shared, on what terms, and with which communities in mind. Specific questions make for more honest answers.',
    ],
  },
  {
    slug: 'a-better-kind-of-digital-assistant',
    title: 'A good assistant knows when not to interrupt',
    excerpt: 'As digital helpers become more proactive, the most thoughtful feature might be knowing when to stay out of the way.',
    category: 'Perspectives', author: 'Sofia Bennett', read: '6 min read',
    image: 'photo-1498050108023-c5249f4df085', accent: 'pink',
    body: [
      'An assistant that can anticipate a need can feel helpful. An assistant that anticipates every need can feel like one more thing demanding attention.',
      'The difference is not just accuracy. It is timing, predictability, and a person’s ability to decide when suggestions are welcome. Quiet defaults and clear controls can be as valuable as a clever prediction.',
      'The tools we enjoy using are not always the ones that do the most. Sometimes they are the ones that understand the value of a little space.',
    ],
  },
]

const categories = ['All stories', 'Technology', 'Research', 'Perspectives', 'Ethics', 'People']
const images = (id: string, width = 1100) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const getSaved = () => {
  try { return JSON.parse(localStorage.getItem('signal-bookmarks') ?? '[]') as string[] }
  catch { return [] }
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => localStorage.getItem('signal-theme') === 'dark')
  const [saved, setSaved] = useState<string[]>(getSaved)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('signal-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.search])

  useEffect(() => {
    const path = location.pathname
    const slug = path.startsWith('/article/') ? path.slice('/article/'.length) : ''
    let title = 'Intelligence, in context.'
    let description = 'Thoughtful perspectives on the technology changing how we live, work, and see the world.'
    let robots = 'index,follow'

    if (path === '/latest') title = 'The latest'
    else if (path === '/trending') {
      title = 'Trending stories'
      description = 'Curated editorial picks from Signal. Illustrative examples, not live popularity rankings.'
    } else if (path === '/categories') title = 'Explore the topics'
    else if (path.startsWith('/category/')) title = decodeURIComponent(path.slice('/category/'.length))
    else if (path === '/bookmarks') title = 'Saved for later'
    else if (path === '/about') {
      title = 'About Signal'
      description = 'An independent editorial project exploring the ideas, people, and technology shaping our future.'
    } else if (path === '/contact') title = 'Contact Signal'
    else if (path === '/search') {
      title = `Search: ${new URLSearchParams(location.search).get('q') ?? ''}`
      robots = 'noindex,follow'
    } else if (slug) {
      let liveStory: Story | undefined
      if (slug.startsWith('live-')) {
        try {
          liveStory = (JSON.parse(localStorage.getItem('signal-live-stories') ?? '[]') as Story[]).find((item) => item.slug === slug)
        } catch (error) {
          console.error('Unable to read saved live story metadata:', error)
        }
      }
      const story = sampleStories.find((item) => item.slug === slug) ?? liveStory
      if (story) {
        title = story.title
        description = story.excerpt
      }
    }

    document.title = `${title} | Signal`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${title} | Signal`)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="robots"]')?.setAttribute('content', robots)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = `${window.location.origin}${path}`
  }, [location.pathname, location.search])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onNavigate = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href]')) setMobileOpen(false)
    }
    document.addEventListener('click', onNavigate)
    return () => document.removeEventListener('click', onNavigate)
  }, [])

  const toggleSave = (slug: string) => setSaved((current) => {
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    localStorage.setItem('signal-bookmarks', JSON.stringify(next))
    return next
  })

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const query = searchText.trim()
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
      setSearchOpen(false)
      setSearchText('')
    }
  }

  return (
    <div className="app-shell">
      <div className="announcement"><Sparkles size={13} /> A little more signal, a little less noise. <Link to="/about">Meet your new reading habit <ArrowRight size={13} /></Link></div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Signal home"><span className="brand-mark"><span /></span><span>signal<span className="brand-dot">.</span></span></Link>
        <nav className={`main-nav ${mobileOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          <Link to="/latest">Latest</Link><Link to="/trending">Trending</Link><Link to="/categories">Topics <ChevronDown size={13} /></Link><Link to="/about">About</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={18} /><kbd><Command size={10} /> K</kbd></button>
          <Link className="icon-button saved-link" to="/bookmarks" aria-label={`Saved stories, ${saved.length} saved`}><Bookmark size={18} />{saved.length > 0 && <span className="saved-count">{saved.length}</span>}</Link>
          <button className="icon-button theme-toggle" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="icon-button mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>{mobileOpen ? <X size={21} /> : <Menu size={21} />}</button>
          <Link to="/latest" className="button button-dark header-cta">Explore stories <ArrowUpRight size={15} /></Link>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname + location.search} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
          <Routes>
            <Route path="/" element={<Home saved={saved} toggleSave={toggleSave} />} />
            <Route path="/latest" element={<Latest saved={saved} toggleSave={toggleSave} />} />
            <Route path="/trending" element={<Trending saved={saved} toggleSave={toggleSave} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:name" element={<CategoryPage saved={saved} toggleSave={toggleSave} />} />
            <Route path="/article/:slug" element={<Article saved={saved} toggleSave={toggleSave} />} />
            <Route path="/search" element={<SearchResults saved={saved} toggleSave={toggleSave} />} />
            <Route path="/bookmarks" element={<Bookmarks saved={saved} toggleSave={toggleSave} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <AnimatePresence>
        {searchOpen && <motion.div className="search-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false) }}>
          <motion.form className="search-dialog" onSubmit={submitSearch} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} role="search">
            <Search size={20} /><input autoFocus aria-label="Search stories" placeholder="Search stories, ideas, people..." value={searchText} onChange={(event) => setSearchText(event.target.value)} /><kbd>ESC</kbd><button type="button" className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={18} /></button>
            <div className="search-hint">TRY SEARCHING FOR <span>AI ethics</span><span>creative tools</span><span>small models</span></div>
          </motion.form>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

function SectionHeading({ kicker, title, link, linkText = 'View all', description }: { kicker: string; title: string; link?: string; linkText?: string; description?: string }) {
  return <div className="section-heading"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2>{description && <p className="section-description">{description}</p>}</div>{link && <Link to={link} className="text-link">{linkText} <ArrowRight size={15} /></Link>}</div>
}

function StoryCard({ story, saved, toggleSave, compact = false, index = 0 }: { story: Story; saved: string[]; toggleSave: (slug: string) => void; compact?: boolean; index?: number }) {
  return <motion.article className={`story-card ${compact ? 'story-compact' : ''}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.35, delay: index % 3 * 0.05 }}>
    <div className={`card-image image-${story.accent}`}><Link to={`/article/${story.slug}`} aria-label={story.title}><img src={story.image.startsWith('remote:') ? story.image.slice(7) : images(story.image, compact ? 720 : 900)} alt="" loading="lazy" /></Link><span className="image-category">{story.category}</span><button className={`bookmark-button ${saved.includes(story.slug) ? 'is-saved' : ''}`} onClick={() => toggleSave(story.slug)} aria-label={saved.includes(story.slug) ? 'Remove bookmark' : 'Bookmark story'}><Bookmark size={16} fill={saved.includes(story.slug) ? 'currentColor' : 'none'} /></button></div>
    <div className="card-copy"><div className="story-meta"><span>{story.author}</span><span className="meta-dot" /><span>{story.read}</span></div><h3><Link to={`/article/${story.slug}`}>{story.title}</Link></h3>{!compact && <p>{story.excerpt}</p>}<Link to={`/article/${story.slug}`} className="card-read">Read story <ArrowRight size={14} /></Link></div>
  </motion.article>
}

function StoryGrid({ stories, saved, toggleSave, compact = false }: { stories: Story[]; saved: string[]; toggleSave: (slug: string) => void; compact?: boolean }) {
  if (!stories.length) return <EmptyState title="Nothing here just yet" detail="Try another topic or check back soon." />
  return <div className={`story-grid ${compact ? 'compact-grid' : ''}`}>{stories.map((story, index) => <StoryCard key={story.slug} story={story} saved={saved} toggleSave={toggleSave} compact={compact} index={index} />)}</div>
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success'>('idle')
  return <section className="newsletter"><div className="newsletter-art"><span /><span /><span /></div><div className="newsletter-content"><p className="eyebrow">A good thing in your inbox</p><h2>Smart reads.<br />Zero noise.</h2><p>A thoughtful digest of the ideas shaping tomorrow. Delivered every Sunday.</p><form onSubmit={(event: FormEvent) => { event.preventDefault(); if (email.trim()) { setStatus('success'); setEmail('') } }} className="newsletter-form"><label className="sr-only" htmlFor="newsletter-email">Email address</label><Mail size={17} /><input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button aria-label="Subscribe"><ArrowRight size={17} /></button></form><div className={`newsletter-note ${status === 'success' ? 'success-note' : ''}`}>{status === 'success' ? <><Check size={13} /> You’re on the list. Look out for a little signal.</> : 'No spam. No noise. Unsubscribe whenever.'}</div></div><div className="newsletter-number">01<span>/01</span></div></section>
}

function Home({ saved, toggleSave }: { saved: string[]; toggleSave: (slug: string) => void }) {
  const lead = sampleStories[0]
  return <div className="page-wrap home-page">
    <section className="hero">
      <div className="hero-copy"><div className="hero-kicker"><span className="pulse-dot" /> THE HUMAN SIDE OF WHAT’S NEXT</div><h1>Intelligence,<br /><span>in context.</span></h1><p>Thoughtful perspectives on the technology changing how we live, work, and see the world.</p><div className="hero-actions"><Link to="/latest" className="button button-dark">Read the latest <ArrowRight size={16} /></Link><Link to="/about" className="button button-quiet">What is Signal? <ArrowUpRight size={15} /></Link></div><div className="hero-footnote"><span className="reader-avatars"><i>m</i><i>j</i><i>a</i></span><span>For curious people, everywhere.</span></div></div>
      <Link className="hero-art" to={`/article/${lead.slug}`} aria-label={`Read ${lead.title}`}><img src={images('photo-1635070041078-e363dbe005cb', 1400)} alt="" /><div className="art-shade" /><div className="hero-art-label"><span className="live-dot" /> THE SIGNAL EDITION <span>NO. 024</span></div><div className="hero-art-caption"><span>THE BIG IDEA</span><h2>What happens when the tools that think start thinking with us?</h2><span className="art-read">Explore the story <ArrowUpRight size={14} /></span></div><div className="art-index">01—06</div></Link>
      <div className="hero-stamp"><Sparkles size={14} /><span>Good questions<br />for a changing world.</span></div>
    </section>
    <div className="sample-banner"><span className="sample-indicator" /> <strong>Editorial samples</strong><span>— AI-generated illustrative stories, not live news.</span><Link to="/about">Learn more <ArrowUpRight size={12} /></Link></div>
    <section className="section-block"><SectionHeading kicker="The good stuff" title="Ideas worth your attention" link="/latest" /><StoryGrid stories={sampleStories.slice(0, 3)} saved={saved} toggleSave={toggleSave} /></section>
    <section className="featured-strip"><div className="featured-text"><p className="eyebrow">A different point of view</p><h2>Technology is never<br />just about technology.</h2><p>It’s about people. The choices we make. And the kind of future we want to build together.</p><Link to="/about" className="text-link">Our perspective <ArrowRight size={15} /></Link></div><div className="featured-visual"><img src={images('photo-1519389950473-47ba0277781c', 1000)} alt="A group collaborating around a table" loading="lazy" /><span>BETTER QUESTIONS. BETTER FUTURES.</span></div></section>
    <section className="section-block second-stories"><SectionHeading kicker="More to explore" title="A few more good reads" link="/trending" linkText="See what’s trending" /><StoryGrid stories={sampleStories.slice(3)} saved={saved} toggleSave={toggleSave} /></section>
    <Newsletter />
  </div>
}

function PageIntro({ kicker, title, description }: { kicker: string; title: ReactNode; description: string }) {
  return <div className="page-intro"><p className="eyebrow"><span className="pulse-dot" /> {kicker}</p><h1>{title}</h1><p>{description}</p></div>
}

function SampleNotice() {
  return <div className="sample-banner"><span className="sample-indicator" /><strong>Editorial samples</strong><span>— AI-generated illustrative stories, not live news.</span></div>
}

function Latest({ saved, toggleSave }: { saved: string[]; toggleSave: (slug: string) => void }) {
  const [stories, setStories] = useState<Story[]>(sampleStories)
  const [apiState, setApiState] = useState<'loading' | 'samples' | 'live' | 'error'>('loading')
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('All stories')
  useEffect(() => {
    let active = true
    fetch('/api/news').then(async (response) => {
      if (!response.ok) throw new Error('News request failed')
      return response.json() as Promise<{ available: boolean; articles?: Array<{ title?: string; description?: string; content?: string; url?: string; image?: string; publishedAt?: string; source?: { name?: string } }> }>
    }).then((data) => {
      if (!active) return
      if (data.available && data.articles?.length) {
        const current = data.articles.filter((article) => article.title && article.url).map((article, index): Story => ({
          slug: `live-${index}`,
          title: article.title ?? 'Untitled story', excerpt: article.description ?? article.content ?? 'Read the original report for more details.',
          category: 'Live news', author: article.source?.name ?? 'News source', read: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Latest',
          image: article.image ? `remote:${article.image}` : 'photo-1451187580459-43490279c0fa', accent: 'blue', body: [article.description ?? 'Read the original report for more details.'], sourceUrl: article.url,
        }))
        localStorage.setItem('signal-live-stories', JSON.stringify(current))
        setStories(current); setApiState('live')
      } else setApiState('samples')
    }).catch(() => { if (active) setApiState('error') })
    return () => { active = false }
  }, [])
  const filtered = category === 'All stories' ? stories : stories.filter((story) => story.category === category)
  const pages = Math.max(1, Math.ceil(filtered.length / 6))
  const visible = filtered.slice((page - 1) * 6, page * 6)
  return <div className="page-wrap listing-page"><PageIntro kicker="Fresh perspective" title="The latest" description="New ideas and thoughtful perspectives on the technology shaping tomorrow." />
    <div className="sample-banner"><span className="sample-indicator" />{apiState === 'live' ? <><strong>Live reports</strong><span>— sourced from GNews, with links to original publishers.</span></> : <><strong>{apiState === 'error' ? 'News feed unavailable' : 'Editorial samples'}</strong><span>— {apiState === 'error' ? 'Showing illustrative stories instead. Live news isn’t available right now.' : 'AI-generated illustrative stories, not live news.'}</span></>}<Link to="/about">About our sources <ArrowUpRight size={12} /></Link></div>
    <div className="filter-row"><div className="filter-pills">{categories.map((name) => <button key={name} onClick={() => { setCategory(name); setPage(1) }} className={`filter-pill ${category === name ? 'active' : ''}`}>{name}</button>)}</div><span className="results-count">{filtered.length} stories</span></div>
    {apiState === 'loading' && <div className="loading-state"><span /><span /><span /><p>Checking for live reports…</p></div>}
    <StoryGrid stories={visible} saved={saved} toggleSave={toggleSave} />
    {pages > 1 && <Pagination page={page} pages={pages} setPage={setPage} />}
    <Newsletter />
  </div>
}

function Pagination({ page, pages, setPage }: { page: number; pages: number; setPage: (page: number) => void }) {
  return <nav className="pagination" aria-label="Pagination"><button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}><ArrowLeft size={14} /> Previous</button><span>Page <strong>{page}</strong> of {pages}</span><button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages}>Next <ArrowRight size={14} /></button></nav>
}

function Trending({ saved, toggleSave }: { saved: string[]; toggleSave: (slug: string) => void }) {
  return <div className="page-wrap listing-page"><PageIntro kicker="Curated selection" title="Trending stories" description="A small collection of ideas our editors think are worth exploring." /><SampleNotice /><section className="trending-note"><TrendingUp size={18} /><span>Illustrative editorial picks. Not live popularity rankings.</span><span className="note-tag">EDITOR’S PICKS</span></section><StoryGrid stories={[...sampleStories].reverse()} saved={saved} toggleSave={toggleSave} /><Newsletter /></div>
}

function Categories() {
  const icons = [<Cpu key="cpu" />, <Layers3 key="layers" />, <Sparkles key="sparkles" />, <Headphones key="headphones" />, <Command key="command" />, <TrendingUp key="trend" />]
  const descriptions = ['The tools and ideas moving our world forward.', 'The people, research, and discoveries behind the headlines.', 'Fresh takes on where technology and humanity meet.', 'Thoughtful conversations about building AI responsibly.', 'The humans at the heart of the technology.', 'The big shifts, patterns, and possibilities to watch.']
  return <div className="page-wrap listing-page"><PageIntro kicker="Find your next rabbit hole" title="Explore the topics" description="Follow your curiosity. There’s more than one way into the future." /><div className="category-grid">{categories.slice(1).map((category, index) => <Link key={category} className={`category-tile tile-${index}`} to={`/category/${encodeURIComponent(category.toLowerCase())}`}><span className="category-icon">{icons[index]}</span><span className="category-index">0{index + 1} / TOPIC</span><h2>{category}</h2><p>{descriptions[index]}</p><span className="category-explore">Explore topic <ArrowUpRight size={15} /></span></Link>)}</div><Newsletter /></div>
}

function CategoryPage({ saved, toggleSave }: { saved: string[]; toggleSave: (slug: string) => void }) {
  const { name = '' } = useParams()
  const category = decodeURIComponent(name).replace(/^\w/, (letter) => letter.toUpperCase())
  const matching = sampleStories.filter((story) => story.category.toLowerCase() === name.toLowerCase())
  return <div className="page-wrap listing-page"><Link to="/categories" className="back-link"><ArrowLeft size={14} /> All topics</Link><PageIntro kicker="Topic collection" title={category} description={`Thoughtful stories and fresh perspectives on ${category.toLowerCase()}.`} /><SampleNotice /><StoryGrid stories={matching} saved={saved} toggleSave={toggleSave} /><Newsletter /></div>
}

function Article({ saved, toggleSave }: { saved: string[]; toggleSave: (slug: string) => void }) {
  const { slug = '' } = useParams()
  const story = sampleStories.find((item) => item.slug === slug)
  const live = slug.startsWith('live-')
  let liveStory: Story | undefined
  if (live) {
    try {
      liveStory = (JSON.parse(localStorage.getItem('signal-live-stories') ?? '[]') as Story[]).find((item) => item.slug === slug)
    } catch (error) {
      console.error('Unable to read saved live story details:', error)
    }
  }
  if (!story && !liveStory) return <NotFound />
  const current = story ?? liveStory
  const externalUrl = current?.sourceUrl
  return <article className="article-page page-wrap">
    <Link to="/latest" className="back-link"><ArrowLeft size={14} /> Back to stories</Link>
    <header className="article-header"><p className="eyebrow">{current?.category ?? 'Live news'} <span className="meta-dot" /> {current?.read ?? ''}</p><h1>{current?.title ?? 'Live report'}</h1><p className="article-deck">{current?.excerpt}</p><div className="article-byline"><div className="author-avatar">{(current?.author ?? 'S')[0]}</div><div><strong>{current?.author ?? 'News source'}</strong><span>{live ? 'Original reporting' : 'Signal contributor'}</span></div><div className="article-actions"><button onClick={() => current && toggleSave(current.slug)} aria-label="Bookmark story"><Bookmark size={17} fill={current && saved.includes(current.slug) ? 'currentColor' : 'none'} /></button><button onClick={() => { if (navigator.share) void navigator.share({ title: current?.title, url: window.location.href }); else void navigator.clipboard?.writeText(window.location.href) }} aria-label="Share story"><Share2 size={17} /></button></div></div></header>
    <div className={`article-cover image-${current?.accent ?? 'blue'}`}>{current?.image && <img src={current.image.startsWith('remote:') ? current.image.slice(7) : images(current.image, 1500)} alt="" />}</div>
    <div className="sample-banner article-notice"><span className="sample-indicator" />{live ? <><strong>Original reporting</strong><span>— Read the full story from its publisher.</span></> : <><strong>Illustrative sample</strong><span>— AI-generated editorial content, not a report of real events.</span></>}</div>
    <div className="article-layout"><div className="article-body">{(current?.body ?? []).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{live && externalUrl && <a className="button button-dark external-story" href={externalUrl} target="_blank" rel="noreferrer">Read original report <ArrowUpRight size={15} /></a>}<div className="article-end"><span>—</span><p>Curiosity looks good on you.</p><div className="article-actions"><button onClick={() => current && toggleSave(current.slug)} aria-label="Bookmark story"><Bookmark size={17} /></button><button onClick={() => { if (navigator.share) void navigator.share({ title: current?.title, url: window.location.href }); else void navigator.clipboard?.writeText(window.location.href) }} aria-label="Share story"><Share2 size={17} /></button></div></div></div><aside className="article-sidebar"><p className="eyebrow">A few more good reads</p>{sampleStories.filter((item) => item.slug !== slug).slice(0, 3).map((item) => <Link key={item.slug} to={`/article/${item.slug}`} className="related-story"><span>{item.category}</span><strong>{item.title}</strong><small>{item.read} <ArrowUpRight size={12} /></small></Link>)}</aside></div>
  </article>
}

function SearchResults({ saved, toggleSave }: { saved: string[]; toggleSave: (slug: string) => void }) {
  const [params] = useSearchParams()
  const query = (params.get('q') ?? '').trim()
  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    return sampleStories.filter((story) => words.some((word) => `${story.title} ${story.excerpt} ${story.category} ${story.author}`.toLowerCase().includes(word)))
  }, [query])
  return <div className="page-wrap listing-page"><PageIntro kicker="Your search" title={<>Results for <span className="query-highlight">“{query || '…'}”</span></>} description={`${results.length} thoughtful ${results.length === 1 ? 'story' : 'stories'} from the Signal archive.`} /><SampleNotice /><StoryGrid stories={results} saved={saved} toggleSave={toggleSave} /><Newsletter /></div>
}

function Bookmarks({ saved, toggleSave }: { saved: string[]; toggleSave: (slug: string) => void }) {
  const stories = sampleStories.filter((story) => saved.includes(story.slug))
  return <div className="page-wrap listing-page"><PageIntro kicker="Your reading list" title="Saved for later" description="Your collection of stories worth coming back to." /><SampleNotice /><StoryGrid stories={stories} saved={saved} toggleSave={toggleSave} /><Newsletter /></div>
}

function About() {
  return <div className="page-wrap about-page"><PageIntro kicker="A little about us" title={<>Less noise.<br /><span className="query-highlight">More meaning.</span></>} description="Signal is an independent editorial project exploring the ideas, people, and technology shaping our future." /><div className="about-image"><img src={images('photo-1521737711867-e3b97375f902', 1500)} alt="A creative team discussing ideas together" /><span>CURIOUS BY DESIGN. HUMAN BY NATURE.</span></div><section className="about-copy"><div><p className="eyebrow">Why we’re here</p><h2>Progress deserves a point of view.</h2></div><div><p>There’s no shortage of noise about AI. What we need is room to think—to ask better questions, listen to more people, and connect the dots between technology and everyday life.</p><p>Signal is a place for thoughtful perspectives, clear-eyed curiosity, and the human stories behind the latest ideas. We believe the future isn’t something that simply happens to us. It’s something we shape, together.</p><Link to="/latest" className="button button-dark">Explore our stories <ArrowRight size={15} /></Link></div></section><section className="editorial-note"><Sparkles size={20} /><div><strong>About the stories you’ll find here</strong><p>Unless a story is explicitly marked as live reporting and linked to its original publisher, our articles are illustrative AI-generated editorial samples—not real-time news or claims about actual events.</p></div></section><Newsletter /></div>
}

function Contact() {
  const [sent, setSent] = useState(false)
  return <div className="page-wrap contact-page"><PageIntro kicker="We’d love to hear from you" title="Let’s talk." description="A good question, a big idea, a thoughtful hello. Our inbox is open." /><div className="contact-layout"><div className="contact-aside"><Mail size={22} /><h2>Good things start<br />with a conversation.</h2><p>Have a story idea, feedback, or a question? Send a note and we’ll be in touch.</p><a href="mailto:hello@signaljournal.example">hello@signaljournal.example <ArrowUpRight size={14} /></a></div>{sent ? <div className="contact-success"><span><Check size={24} /></span><h2>Message received.</h2><p>Thanks for reaching out. We’ll get back to you soon.</p><button className="button button-quiet" onClick={() => setSent(false)}>Send another note</button></div> : <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><label>Your name<input required name="name" placeholder="The name your friends use" /></label><label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label><label>What’s on your mind?<textarea required name="message" rows={5} placeholder="Tell us a little about it..." /></label><button className="button button-dark">Send your note <Send size={15} /></button><p className="form-note">This demo form displays a local confirmation; no message is transmitted.</p></form>}</div><Newsletter /></div>
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="empty-state"><span><Search size={22} /></span><h2>{title}</h2><p>{detail}</p><Link to="/latest" className="text-link">Browse the latest <ArrowRight size={14} /></Link></div>
}

function NotFound() {
  return <div className="page-wrap not-found"><span>404 / WRONG TURN</span><h1>Well, this is<br /><em>unexpected.</em></h1><p>We couldn’t find that page. But there are plenty of good stories waiting.</p><Link className="button button-dark" to="/">Back to Signal <ArrowRight size={15} /></Link></div>
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div className="footer-brand"><Link className="brand" to="/"><span className="brand-mark"><span /></span><span>signal<span className="brand-dot">.</span></span></Link><p>A little more signal,<br />a little less noise.</p></div><div className="footer-links"><div><span>EXPLORE</span><Link to="/latest">Latest</Link><Link to="/trending">Trending</Link><Link to="/categories">Topics</Link></div><div><span>THE JOURNAL</span><Link to="/about">About Signal</Link><Link to="/contact">Get in touch</Link><Link to="/bookmarks">Reading list</Link></div><div><span>FOLLOW YOUR CURIOSITY</span><Link to="/search?q=AI">AI &amp; the future <ArrowUpRight size={12} /></Link><Link to="/category/research">Research <ArrowUpRight size={12} /></Link><Link to="/category/ethics">Ethics <ArrowUpRight size={12} /></Link></div></div><div className="footer-signoff">STAY<br /><span>CURIOUS</span><ArrowDown size={16} /></div></div><div className="footer-bottom"><span>© 2026 Signal Journal. Made for curious minds.</span><span>Illustrative samples are labeled. Live reporting links to its source.</span><Link to="/contact">Say hello <ArrowUpRight size={12} /></Link></div></footer>
}

export default App
