import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Compass, Heart, MessageCircle, Sparkles, Users, WandSparkles } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

const highlights = [
  { icon: Heart, title: 'Share your real life', text: 'Tiny wins, big milestones, and all the in-between moments.' },
  { icon: Users, title: 'Find your people', text: 'Meet kindred spirits around the things you care about.' },
  { icon: Sparkles, title: 'Grow together', text: 'A thoughtful corner for stories, encouragement, and fresh starts.' }
];

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="landing-page">
      <div className="landing-glow landing-glow-one" /><div className="landing-glow landing-glow-two" />
      <SiteHeader />
      <main>
        <section className="hero-section page-width">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="pulse-dot" /> A LITTLE MORE HUMAN, A LITTLE MORE CONNECTED</div>
            <h1>Every connection<br />begins with a <span>story.</span></h1>
            <p className="hero-description">A welcoming space to share what matters, discover your people, and make the everyday feel a little less ordinary.</p>
            <div className="hero-actions">
              <Link className="button button-gradient" to={user ? '/app' : '/register'}>Find your community <ArrowRight size={17} /></Link>
              <a className="button button-quiet" href="#explore"><Compass size={17} /> Explore Interlinka</a>
            </div>
            <div className="hero-trust"><div className="avatar-stack"><span>M</span><span>A</span><span>J</span><span>+</span></div><span>A little corner of the internet, built for <strong>real connection.</strong></span></div>
          </div>
          <div className="community-preview" aria-label="Community feed preview">
            <div className="preview-orbit orbit-one" /><div className="preview-orbit orbit-two" />
            <article className="preview-card preview-main">
              <div className="preview-top"><span className="preview-brand"><span className="brand-mark"><Sparkles size={14} /></span>interlinka</span><span className="preview-online"><i /> community is here</span></div>
              <div className="preview-story-row"><span className="preview-story preview-add">+</span><span className="preview-story story-one">S</span><span className="preview-story story-two">J</span><span className="preview-story story-three">K</span><span className="preview-story story-four">M</span><small>little moments</small></div>
              <div className="preview-post">
                <div className="preview-post-header"><span className="preview-avatar">A</span><span><b>Alex Morgan</b><small>@alexmorgan · 12 min</small></span><span className="preview-more">···</span></div>
                <p>Taking the long way home today. Turns out the sunset had other plans for me. 🌿</p>
                <div className="preview-image"><div className="sunset-sun" /><div className="sunset-hill sunset-hill-one" /><div className="sunset-hill sunset-hill-two" /><span>somewhere, taking it slow</span></div>
                <div className="preview-reactions"><span><Heart size={15} fill="currentColor" /> 24</span><span><MessageCircle size={15} /> 6 kind words</span></div>
              </div>
            </article>
            <div className="floating-note note-top"><span className="note-icon"><Heart size={15} fill="currentColor" /></span><span><b>A little kindness</b><small>goes a long way</small></span></div>
            <div className="floating-note note-bottom"><span className="note-icon note-spark"><Sparkles size={16} /></span><span><b>Your people are here</b><small>come as you are</small></span></div>
            <span className="preview-spark spark-one">✦</span><span className="preview-spark spark-two">✧</span>
          </div>
          <a className="scroll-cue" href="#about"><ArrowDown size={14} /> A LITTLE MORE</a>
        </section>
        <section className="landing-intro section-pad" id="about">
          <div className="page-width intro-grid">
            <div><span className="eyebrow">A PLACE TO BE YOURSELF</span><h2>Not just a feed.<br /><span>A feeling of belonging.</span></h2></div>
            <p>We believe the best communities begin with small acts of sharing. Interlinka brings people together around the moments, thoughts, and bright ideas that make life yours.</p>
          </div>
        </section>
        <section className="feature-section section-pad page-width" id="explore">
          <div className="section-heading landing-section-heading"><div><span className="eyebrow">A COMMUNITY THAT FEELS LIKE YOU</span><h2>More room for <span>meaningful.</span></h2></div><p>Simple ways to share a little more of life—and find a little more of each other.</p></div>
          <div className="feature-grid">{highlights.map(({ icon: Icon, title, text }, index) => <article className={`feature-card feature-card-${index + 1}`} key={title}><span className="feature-icon"><Icon size={20} /></span><span className="feature-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p><ArrowUpRight size={17} className="feature-arrow" /></article>)}</div>
        </section>
        <section className="quote-band section-pad"><div className="quote-band-inner page-width"><WandSparkles size={20} /><p>“The most beautiful discovery true friends make is that they can grow separately without growing apart.”</p><span>— Elisabeth Foley</span></div></section>
        <section className="landing-cta page-width"><div><span className="eyebrow">YOUR STORY FITS HERE</span><h2>Make room for a little more <span>connection.</span></h2><p>Come as you are. There’s a community waiting to meet you.</p><Link className="button button-gradient" to={user ? '/app' : '/register'}>Get started for free <ArrowRight size={17} /></Link></div><div className="cta-decoration"><Sparkles size={56} /><span /><span /></div></section>
      </main>
      <footer className="site-footer page-width"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={18} /></span>interlinka</Link><span>Connecting people, stories, and communities.</span><span>© {new Date().getFullYear()} Interlinka</span></footer>
    </div>
  );
}
