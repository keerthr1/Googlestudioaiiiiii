import React, { useState, useEffect } from 'react';
import { HeroCharacter } from './components/HeroCharacter';

export default function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [resumeOpen, setResumeOpen] = useState(false);
  const folderBodyRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('case-studies-nav');
      if (nav && !nav.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle URL hash navigation (e.g. returning from case studies page)
  useEffect(() => {
    const handleHashNav = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'resume') {
        window.open('https://drive.google.com/file/d/13F5AWdAowd_L5jzegAMzhspee3-vKIRM/view', '_blank', 'noopener,noreferrer');
      } else if (hash) {
        setActiveTab(hash);
        setTimeout(() => {
          const target = document.getElementById(hash);
          if (target && folderBodyRef.current) {
            const bodyRect = folderBodyRef.current.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const targetTop = targetRect.top - bodyRect.top + folderBodyRef.current.scrollTop;
            folderBodyRef.current.scrollTo({ top: targetTop, behavior: 'smooth' });
          }
        }, 100);
      }
    };

    handleHashNav();
    window.addEventListener('hashchange', handleHashNav);
    return () => window.removeEventListener('hashchange', handleHashNav);
  }, []);

  // Active section scroll observer inside document frame (throttled with RAF)
  useEffect(() => {
    const sections = ['work', 'about', 'contact'];
    let ticking = false;

    const updateActiveTab = () => {
      ticking = false;
      const bodyEl = folderBodyRef.current;
      if (!bodyEl) return;
      
      let current = '';
      if (bodyEl.clientHeight + bodyEl.scrollTop >= bodyEl.scrollHeight - 60) {
        current = 'contact';
      } else {
        const bodyRect = bodyEl.getBoundingClientRect();
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const relativeTop = rect.top - bodyRect.top;
            if (relativeTop <= 250 && rect.bottom >= bodyRect.top + 150) {
              current = id;
            }
          }
        }
      }
      setActiveTab(current);
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveTab);
      }
    };

    updateActiveTab();
    const bodyEl = folderBodyRef.current;
    if (bodyEl) {
      bodyEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (bodyEl) {
        bodyEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleNavClick = (tab: string, e: React.MouseEvent) => {
    if (tab === 'resume') {
      return;
    }
    e.preventDefault();
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);

    if (tab === 'top' || tab === '') {
      folderBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.getElementById(tab);
    if (target && folderBodyRef.current) {
      const bodyRect = folderBodyRef.current.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetTop = targetRect.top - bodyRect.top + folderBodyRef.current.scrollTop;
      folderBodyRef.current.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-full h-[100dvh] w-full max-w-full overflow-hidden flex flex-col p-3 sm:px-4 sm:py-[18px] md:px-5 md:py-[22px] lg:px-6 lg:pt-[17px] lg:pb-[19px] box-border mx-auto">
      {/* Top Fixed Floating Nav (Case Studies) */}
      <div className="absolute top-[20px] right-3 sm:top-[22px] sm:right-4 md:top-[25px] md:right-5 lg:top-[19px] lg:right-6 z-[100] flex items-center gap-2">
        {/* Case Studies Dropdown */}
        <div className="relative" id="case-studies-nav">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#C8D4E8] bg-white/90 backdrop-blur-sm cursor-pointer text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.12em] text-[#2036B8] transition-all hover:border-[#2036B8] focus:outline-none active:outline-none focus:ring-0 active:bg-white/90 select-none active:font-medium focus:font-medium"
          >
            Case Studies
          </button>
          {dropdownOpen && (
            <div className="cs-dropdown open animate-in fade-in slide-in-from-top-2 duration-150 whitespace-nowrap">
              <a href="case-study.html?project=youtopia" className="cs-dropdown-item text-[13px] font-normal active:font-normal flex items-center justify-between whitespace-nowrap">
                <span className="whitespace-nowrap text-[13px]">01 — Youtopia</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 shrink-0 ml-2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </a>
              <a href="case-study.html?project=revlr" className="cs-dropdown-item text-[13px] font-normal active:font-normal flex items-center justify-between whitespace-nowrap">
                <span className="whitespace-nowrap text-[13px]">02 — REVLR</span>
              </a>
              <a href="case-study.html?project=justickets" className="cs-dropdown-item text-[13px] font-normal active:font-normal flex items-center justify-between whitespace-nowrap">
                <span className="whitespace-nowrap text-[13px]">03 — Justickets</span>
              </a>
              <a href="case-study.html?project=myblockcounts" className="cs-dropdown-item text-[13px] font-normal active:font-normal flex items-center justify-between whitespace-nowrap">
                <span className="whitespace-nowrap text-[13px]">04 — My Block Counts</span>
              </a>
              <a
                href="https://kaystudio.framer.website/"
                target="_blank"
                rel="noopener noreferrer"
                className="cs-dropdown-item text-[13px] font-normal active:font-normal flex items-center justify-between whitespace-nowrap"
              >
                <span className="whitespace-nowrap text-[13px]">Beyond Product</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Folder Layout Wrapper */}
      <div className="folder-wrapper">
        {/* Sticky Folder Tabs Row */}
        <div className="folder-tabs">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('');
              folderBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              if (window.location.hash) {
                window.history.pushState('', document.title, window.location.pathname + window.location.search);
              }
            }}
            className="folder-tab-logo"
            aria-label="Keerthana R. Home"
          >
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M 6 50 L 46 8 L 70 8 C 84 8 92 17 92 29 C 92 41 84 50 72 50 L 6 50 Z" />
              <line x1="42" y1="33" x2="66" y2="9" />
              <path d="M 6 50 L 66 92 L 80 78 L 48 50" />
            </svg>
          </a>
          <div className="folder-nav-row">
            <a
              href="#work"
              onClick={(e) => handleNavClick('work', e)}
              className={`folder-tab-nav ${activeTab === 'work' ? 'active' : ''}`}
            >
              <span>Work</span>
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick('about', e)}
              className={`folder-tab-nav ${activeTab === 'about' ? 'active' : ''}`}
            >
              <span>About</span>
            </a>
            <a
              href="https://drive.google.com/file/d/13F5AWdAowd_L5jzegAMzhspee3-vKIRM/view"
              target="_blank"
              rel="noopener noreferrer"
              className="folder-tab-nav"
            >
              <span>Resume</span>
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick('contact', e)}
              className={`folder-tab-nav ${activeTab === 'contact' ? 'active' : ''}`}
            >
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Main Folder Content Body / Document Frame */}
        <div className="folder-body" ref={folderBodyRef}>
          {/* HERO SECTION */}
          <section id="top" className="relative min-h-[calc(100vh-100px)] flex flex-col justify-center py-6 sm:py-8 lg:py-12 mb-[40px] sm:mb-[70px] overflow-hidden">
            <div className="mx-auto max-w-[1200px] w-full px-4 sm:px-6 md:px-10 lg:px-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                <div className="lg:col-span-7">
                  <h1 className="font-display text-[28px] sm:text-[42px] md:text-[56px] lg:text-[66px] xl:text-[76px] leading-[1.08] text-heading">
                    Turning ambiguous problems into products people can actually use.
                  </h1>
                  <div className="mt-5 sm:mt-6 md:mt-8 max-w-[640px]">
                    <p className="text-[14px] sm:text-[15px] leading-[1.65] text-fg">
                      I design AI, enterprise, and consumer products from 0→1 to scale, partnering with research, engineering, and product teams to simplify complexity, shape product direction, and build systems that hold up in production.
                    </p>
                    <p className="text-[14px] sm:text-[15px] leading-[1.65] text-fg mt-3 md:mt-4">
                      I like problems that don't come with a template, where the real job is figuring out what the product even is before figuring out what it looks like.
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0">
                  <HeroCharacter />
                </div>
              </div>
            </div>
          </section>

          {/* PRACTICES / CAPABILITIES SECTION */}
          <section className="border-t border-[#2036B8] py-12 sm:py-20 md:py-32">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-10 lg:px-16">
              <div className="grid grid-cols-1 gap-8 md:gap-12">
                <div>
                  <h2 className="font-display text-[24px] sm:text-[34px] md:text-[48px] lg:text-[56px] leading-[1.08] text-heading">
                    Practices I bring to a team
                  </h2>
                </div>
                <div>
                  <ul className="divide-y divide-[#2036B8] border-t border-b border-[#2036B8]">
                    <li className="py-5 sm:py-6 md:py-8">
                      <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-x-6 md:items-start">
                        <div className="flex items-center gap-3.5 sm:gap-4.5 md:gap-5 md:col-span-5">
                          <span className="text-[12px] sm:text-[13px] text-muted font-medium shrink-0 w-6 md:w-auto">01.</span>
                          <h3 className="font-display text-[18px] sm:text-[22px] md:text-[28px] text-accent leading-[1.1]">0→1 Product Design</h3>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-5">
                          <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] text-fg">From first concept to a shippable, scalable system.</p>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-2 md:text-right pt-0.5 md:pt-0">
                          <a href="case-study.html?project=youtopia" className="group text-[12px] sm:text-[13px] text-accent inline-flex items-center gap-1 font-medium">
                            Youtopia <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="py-5 sm:py-6 md:py-8">
                      <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-x-6 md:items-start">
                        <div className="flex items-center gap-3.5 sm:gap-4.5 md:gap-5 md:col-span-5">
                          <span className="text-[12px] sm:text-[13px] text-muted font-medium shrink-0 w-6 md:w-auto">02.</span>
                          <h3 className="font-display text-[18px] sm:text-[22px] md:text-[28px] text-accent leading-[1.1]">AI Product Design</h3>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-5">
                          <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] text-fg">Designing where automation leads and where humans stay in control.</p>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-2 md:text-right pt-0.5 md:pt-0">
                          <a href="case-study.html?project=youtopia" className="group text-[12px] sm:text-[13px] text-accent inline-flex items-center gap-1 font-medium">
                            Youtopia <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="py-5 sm:py-6 md:py-8">
                      <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-x-6 md:items-start">
                        <div className="flex items-center gap-3.5 sm:gap-4.5 md:gap-5 md:col-span-5">
                          <span className="text-[12px] sm:text-[13px] text-muted font-medium shrink-0 w-6 md:w-auto">03.</span>
                          <h3 className="font-display text-[18px] sm:text-[22px] md:text-[28px] text-accent leading-[1.1]">VR / Emerging Interfaces</h3>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-5">
                          <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] text-fg">Building interaction models where no conventions exist yet.</p>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-2 md:text-right pt-0.5 md:pt-0">
                          <a href="case-study.html?project=revlr" className="group text-[12px] sm:text-[13px] text-accent inline-flex items-center gap-1 font-medium">
                            REVLR <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="py-5 sm:py-6 md:py-8">
                      <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-x-6 md:items-start">
                        <div className="flex items-center gap-3.5 sm:gap-4.5 md:gap-5 md:col-span-5">
                          <span className="text-[12px] sm:text-[13px] text-muted font-medium shrink-0 w-6 md:w-auto">04.</span>
                          <h3 className="font-display text-[18px] sm:text-[22px] md:text-[28px] text-accent leading-[1.1]">Design Systems</h3>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-5">
                          <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] text-fg">Building components that hold up under real production constraints.</p>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-2 md:text-right pt-0.5 md:pt-0">
                          <a href="case-study.html?project=justickets" className="group text-[12px] sm:text-[13px] text-accent inline-flex items-center gap-1 font-medium">
                            Justickets <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="py-5 sm:py-6 md:py-8">
                      <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-x-6 md:items-start">
                        <div className="flex items-center gap-3.5 sm:gap-4.5 md:gap-5 md:col-span-5">
                          <span className="text-[12px] sm:text-[13px] text-muted font-medium shrink-0 w-6 md:w-auto">05.</span>
                          <h3 className="font-display text-[18px] sm:text-[22px] md:text-[28px] text-accent leading-[1.1]">Accessibility Research</h3>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-5">
                          <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] text-fg">Designing and testing with accessibility as a starting constraint.</p>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-2 md:text-right pt-0.5 md:pt-0">
                          <a href="case-study.html?project=revlr" className="group text-[12px] sm:text-[13px] text-accent inline-flex items-center gap-1 font-medium">
                            REVLR <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="py-5 sm:py-6 md:py-8">
                      <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-x-6 md:items-start">
                        <div className="flex items-center gap-3.5 sm:gap-4.5 md:gap-5 md:col-span-5">
                          <span className="text-[12px] sm:text-[13px] text-muted font-medium shrink-0 w-6 md:w-auto">06.</span>
                          <h3 className="font-display text-[18px] sm:text-[22px] md:text-[28px] text-accent leading-[1.1]">Civic Technology</h3>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-5">
                          <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] text-fg">Turning dense public data into something a resident can actually use.</p>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-2 md:text-right pt-0.5 md:pt-0">
                          <a href="case-study.html?project=myblockcounts" className="group text-[12px] sm:text-[13px] text-accent inline-flex items-center gap-1 font-medium">
                            My Block Counts <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="py-5 sm:py-6 md:py-8">
                      <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-x-6 md:items-start">
                        <div className="flex items-center gap-3.5 sm:gap-4.5 md:gap-5 md:col-span-5">
                          <span className="text-[12px] sm:text-[13px] text-muted font-medium shrink-0 w-6 md:w-auto">07.</span>
                          <h3 className="font-display text-[18px] sm:text-[22px] md:text-[28px] text-accent leading-[1.1]">Course Design</h3>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-5">
                          <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] text-fg">Turning practiced design judgment into teachable curriculum.</p>
                        </div>
                        <div className="pl-8 md:pl-0 md:col-span-2 md:text-right pt-0.5 md:pt-0">
                          <a href="https://www.outcomeschool.org/uiux-design" target="_blank" rel="noopener noreferrer" className="group text-[12px] sm:text-[13px] text-accent inline-flex items-center gap-1 font-medium">
                            Outcome School <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

         {/* MENTORSHIP SECTION */}
          <section id="mentorship" className="w-full border-t border-b border-[#2036B8] lg:min-h-[calc(100vh-84px)] lg:h-[calc(100vh-84px)] lg:max-h-[calc(100vh-84px)] flex flex-col justify-center overflow-hidden">
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2036B8]">
              
              {/* Left Column: Solid Blue Background with Binary Flower */}
              <div className="bg-[#2036B8] relative flex flex-col items-center justify-center min-h-[296px] sm:min-h-[376px] lg:min-h-0 lg:h-full p-6 sm:p-10 lg:p-[46px] xl:p-[62px] overflow-hidden">
                <iframe
                  src="/Home/Flower.html"
                  title="Binary flower animation"
                  loading="lazy"
                  className="w-full h-full absolute inset-0 border-0 bg-[#2036B8] pointer-events-none select-none"
                />
              </div>

              {/* Right Column: Light Grid Background with Content */}
              <div className="bg-[#F6F6F8] dark:bg-[#0E0E17] bg-[linear-gradient(to_right,rgba(32,54,184,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(32,54,184,0.09)_1px,transparent_1px)] bg-[size:28px_28px] p-8 sm:p-12 md:p-14 lg:p-[46px] xl:p-[62px] lg:h-full flex flex-col justify-center overflow-y-auto">
                <div className="max-w-[650px] mx-auto lg:mx-0">
                  <h2 className="font-display text-[32px] sm:text-[44px] md:text-[52px] lg:text-[52px] xl:text-[62px] font-bold uppercase leading-[0.98] text-[#2036B8] tracking-tight mb-6 sm:mb-8">
                    HELPING OTHER DESIGNERS<br className="hidden sm:inline" /> GROW
                  </h2>

                  <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-[14.5px] sm:text-[15.5px] lg:text-[16px] xl:text-[17px] leading-[1.6] text-[#1B1B26] dark:text-[#E2E2E8]">
                    <p>
                      Great product design isn't just about making good decisions. It's also about helping other people make them.
                    </p>
                    <p>
                      At Qube Cinema, I mentored design interns through real product work, helping them navigate design decisions, feedback, and cross functional collaboration. At Outcome School, I designed curriculum that turns product design practice into structured learning for hundreds of aspiring designers.
                    </p>
                    <p>
                      Teaching and mentoring have made me a clearer communicator, a stronger collaborator, and a more thoughtful product designer.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* SELECTED WORK SECTION */}
          <section id="work" className="border-t border-[#2036B8] py-12 sm:py-20 md:py-32">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-10 lg:px-16">
              <h2 className="font-display text-[26px] sm:text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] text-heading">Selected Work</h2>
              <p className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] md:text-[17px] leading-[1.6] sm:leading-[1.65] text-fg w-full">
                From AI systems and immersive interfaces to civic platforms and consumer products, each project represents a different kind of problem and the decisions required to solve it.
              </p>

              <div className="mt-8 sm:mt-12 md:mt-16 space-y-6">

                {/* PROJECT 1: YOUTOPIA */}
                <a href="case-study.html?project=youtopia" className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 border border-accent rounded-2xl bg-transparent hover:bg-white mb-6 sm:mb-8 cursor-pointer block transition-all duration-300 hover:scale-[1.01]">
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-heading mt-2 sm:mt-3 mb-3 sm:mb-4 pr-6">Youtopia</h3>
                      <p className="text-[13px] sm:text-[14px] md:text-[15px] text-fg leading-[1.6] sm:leading-[1.7] mb-4 sm:mb-6">Designing six interconnected products from consumer onboarding to restaurant operations around a shared AI nutrition platform still being defined.</p>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 py-3 sm:py-4 border-y border-[#cccad8]">
                        <div>
                          <div className="font-display text-xl sm:text-2xl font-medium text-heading">25%+</div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 text-muted">Task Efficiency</div>
                        </div>
                        <div>
                          <div className="font-display text-xl sm:text-2xl font-medium text-heading">Reusable</div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 text-muted">Design Patterns</div>
                        </div>
                      </div>

                      <div className="mb-4 sm:mb-6">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <span className="work-card-tag">AI</span>
                          <span className="work-card-tag">0→1</span>
                          <span className="work-card-tag">Product Strategy</span>
                          <span className="work-card-tag">Systems Thinking</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] sm:text-[13px] uppercase tracking-[0.18em] text-accent inline-flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-4 text-left font-medium">
                      <span>View Case Study</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                  </div>
                  <div className="lg:col-span-7 bg-transparent rounded-xl min-h-[260px] sm:min-h-[320px] lg:min-h-[400px] overflow-hidden">
                    <img
                      src="/Home/Y_WC.webp"
                      alt="Youtopia Work Preview"
                      className="w-full h-full object-cover"
                      width={1200}
                      height={633}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                </a>

                {/* PROJECT 2: REVLR */}
                <a href="case-study.html?project=revlr" className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 border border-accent rounded-2xl bg-transparent hover:bg-white mb-6 sm:mb-8 cursor-pointer block transition-all duration-300 hover:scale-[1.01]">
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-heading mt-2 sm:mt-3 mb-3 sm:mb-4">REVLR</h3>
                      <p className="text-[13px] sm:text-[14px] md:text-[15px] text-fg leading-[1.6] sm:leading-[1.7] mb-4 sm:mb-6">Spatial interaction framework for complex system modeling in virtual reality.</p>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 py-3 sm:py-4 border-y border-[#cccad8]">
                        <div>
                          <div className="font-display text-xl sm:text-2xl font-medium text-heading">+40%</div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 text-muted">User Engagement</div>
                        </div>
                        <div>
                          <div className="font-display text-xl sm:text-2xl font-medium text-heading">-30%</div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 text-muted">Cognitive Load</div>
                        </div>
                      </div>

                      <div className="mb-4 sm:mb-6">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <span className="work-card-tag">HCI</span>
                          <span className="work-card-tag">Accessibility</span>
                          <span className="work-card-tag">Emerging Interfaces</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] sm:text-[13px] uppercase tracking-[0.18em] text-accent inline-flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-4 text-left font-medium">
                      <span>View Case Study</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                  </div>
                  <div className="lg:col-span-7 bg-transparent rounded-xl min-h-[260px] sm:min-h-[320px] lg:min-h-[400px] overflow-hidden">
                    <img
                      src="/Home/R_WC.webp"
                      alt="REVLR Work Preview"
                      className="w-full h-full object-cover"
                      width={1584}
                      height={1042}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </a>

                {/* PROJECT 3: JUSTICKETS */}
                <a href="case-study.html?project=justickets" className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 border border-accent rounded-2xl bg-transparent hover:bg-white mb-6 sm:mb-8 cursor-pointer block transition-all duration-300 hover:scale-[1.01]">
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-heading mt-2 sm:mt-3 mb-3 sm:mb-4">Justickets</h3>
                      <p className="text-[13px] sm:text-[14px] md:text-[15px] text-fg leading-[1.6] sm:leading-[1.7] mb-4 sm:mb-6">Scaling a production movie-ticketing product without slowing feature delivery.</p>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 py-3 sm:py-4 border-y border-[#cccad8]">
                        <div>
                          <div className="font-display text-xl sm:text-2xl font-medium text-heading">1M+</div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 text-muted">Platform Downloads</div>
                        </div>
                        <div>
                          <div className="font-display text-xl sm:text-2xl font-medium text-heading">Optimized</div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 text-muted">Purchase Funnel</div>
                        </div>
                      </div>

                      <div className="mb-4 sm:mb-6">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <span className="work-card-tag">Design Systems</span>
                          <span className="work-card-tag">Consumer Products</span>
                          <span className="work-card-tag">Production Collaboration</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] sm:text-[13px] uppercase tracking-[0.18em] text-accent inline-flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-4 text-left font-medium">
                      <span>View Case Study</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                  </div>
                  <div className="lg:col-span-7 bg-transparent rounded-xl min-h-[260px] sm:min-h-[320px] lg:min-h-[400px] overflow-hidden">
                    <img
                      src="/Home/JT_WC.webp"
                      alt="Justickets Work Preview"
                      className="w-full h-full object-cover"
                      width={1376}
                      height={768}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </a>

                {/* PROJECT 4: MY BLOCK COUNTS */}
                <a href="case-study.html?project=myblockcounts" className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 border border-accent rounded-2xl bg-transparent hover:bg-white mb-6 sm:mb-8 cursor-pointer block transition-all duration-300 hover:scale-[1.01]">
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-heading mt-2 sm:mt-3 mb-3 sm:mb-4">My Block Counts</h3>
                      <p className="text-[13px] sm:text-[14px] md:text-[15px] text-fg leading-[1.6] sm:leading-[1.7] mb-4 sm:mb-6">Redesigning an abandoned civic app so that filling out a survey felt like activism, not a form.</p>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 py-3 sm:py-4 border-y border-[#cccad8]">
                        <div>
                          <div className="font-display text-xl sm:text-2xl font-medium text-heading">+30%</div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 text-muted">User Engagement</div>
                        </div>
                        <div>
                          <div className="font-display text-xl sm:text-2xl font-medium text-heading">Simplified</div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 text-muted">Info Structures</div>
                        </div>
                      </div>

                      <div className="mb-4 sm:mb-6">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <span className="work-card-tag">Research Synthesis</span>
                          <span className="work-card-tag">Information Architecture</span>
                          <span className="work-card-tag">Civic Technology</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] sm:text-[13px] uppercase tracking-[0.18em] text-accent inline-flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-4 text-left font-medium">
                      <span>View Case Study</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:rotate-45"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                  </div>
                  <div className="lg:col-span-7 bg-transparent rounded-xl min-h-[260px] sm:min-h-[320px] lg:min-h-[400px] overflow-hidden">
                    <img
                      src="/Home/MYBC_WC.webp"
                      alt="My Block Work Preview"
                      className="w-full h-full object-cover"
                      width={1584}
                      height={1042}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </a>

              </div>
            </div>
          </section>

          {/* DESIGN PRINCIPLES SECTION */}
          <section className="border-t border-[#2036B8] py-12 sm:py-20 md:py-32">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-10 lg:px-16">
              <h2 className="font-display text-[24px] sm:text-[34px] md:text-[48px] lg:text-[56px] leading-[1.08] text-heading mb-6 sm:mb-12 md:mb-16">
                Design Principles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2036B8]">
                <div className="pb-6 md:pb-0 md:pr-8 lg:pr-10 flex flex-col justify-start">
                  <h3 className="font-display text-[18px] sm:text-[20px] md:text-[24px] text-heading leading-[1.2]">
                    Start with the decision, not the interface.
                  </h3>
                  <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] sm:leading-[1.65] text-fg mt-2 sm:mt-2.5">
                    The hardest part of product design isn't choosing a layout. It's identifying the decision that moves the product forward.
                  </p>
                </div>

                <div className="py-6 md:py-0 md:px-8 lg:px-10 flex flex-col justify-start">
                  <h3 className="font-display text-[18px] sm:text-[20px] md:text-[24px] text-heading leading-[1.2]">
                    Build systems, not pages.
                  </h3>
                  <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] sm:leading-[1.65] text-fg mt-2 sm:mt-2.5">
                    Good products scale because the thinking behind them scales.
                  </p>
                </div>

                <div className="pt-6 md:pt-0 md:pl-8 lg:pl-10 flex flex-col justify-start">
                  <h3 className="font-display text-[18px] sm:text-[20px] md:text-[24px] text-heading leading-[1.2]">
                    Measure success by outcomes.
                  </h3>
                  <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.6] sm:leading-[1.65] text-fg mt-2 sm:mt-2.5">
                    Every decision should improve something measurable, for users, the business, or the team building the product.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="border-t border-[#2036B8] py-16 sm:py-24 md:py-36">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-10 lg:px-16">
              <div className="grid grid-cols-12 gap-x-6 gap-y-8 md:gap-y-12 items-center">
                <div className="hidden md:flex col-span-12 md:col-span-5 justify-center items-center">
                  <div className="overflow-hidden rounded-xl aspect-[4/5] flex items-center justify-center max-w-[320px] sm:max-w-[360px] md:max-w-[400px] w-full mx-auto shadow-sm">
                    <img
                     src="/Home/about.png"
                     alt="Kay portrait illustration"
                     className="w-full h-full object-cover"
                     loading="lazy"
                     decoding="async"
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6 md:col-start-7">
                  <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.24em] text-muted font-medium">About</p>
                  <h2 className="mt-3 sm:mt-6 font-display text-[24px] sm:text-[34px] md:text-[48px] lg:text-[56px] leading-[1.08] text-heading">Hi, I'm Kay</h2>
                  
                  {/* Mobile-only portrait image after "About \n Hi, I'm Kay" and before paragraph */}
                  <div className="my-5 md:hidden overflow-hidden rounded-xl aspect-[4/5] flex items-center justify-center max-w-[280px] sm:max-w-[320px] w-full mx-auto shadow-sm">
                    <img
                     src="/Home/about.png"
                     alt="Kay portrait illustration"
                     className="w-full h-full object-cover"
                     loading="lazy"
                     decoding="async"
                     />
                  </div>

                  <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-6 text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] sm:leading-[1.65] text-fg">
                    <p>I didn't start in product design. I started in illustration, drawing characters and building visual worlds long before I touched Figma. That instinct never really left, it's why I still care as much about how something feels as how it functions.</p>
                    <p>Somewhere along the way I got pulled toward a harder problem: not how do I make this beautiful, but how do I make this make sense. My background in human centered computing gave me the research and systems thinking, the illustration background kept the human part from getting lost in the process. Together they shape how I work now, on AI systems people don't trust yet, VR interfaces with no rulebook, civic platforms nobody wants to open.</p>
                    <p>Outside of design, I climb, play guitar, and try to spend real time away from a screen, usually with people I like, good food, and better music. I think community and human connection are underrated design problems too, which is part of why I teach.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section id="contact" className="border-t border-[#2036B8] pt-12 sm:pt-16 md:pt-24">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-10 lg:px-16">
              <h2 className="font-display text-[22px] sm:text-[34px] md:text-[52px] lg:text-[72px] leading-[1.08] text-heading">
                Building something complex?<br />I'd love to help make it simpler.
              </h2>
              <p className="mt-4 sm:mt-8 max-w-[640px] text-[14px] sm:text-[16px] md:text-[18px] leading-[1.65] md:leading-[1.7] text-fg">
                Whether you're exploring a new product, improving an existing one, or just want to talk about design, feel free to reach out.
              </p>
            </div>

            {/* SOCIAL LINKS GRID STRIP (FOOTER SECTION) */}
            <div className="mt-12 sm:mt-16 border-t border-b border-[#2036B8]">
              <div className="mx-auto max-w-[1200px] grid grid-cols-4 divide-x divide-[#2036B8] border-x border-[#2036B8]">
                
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/summershuttle/?hl=en" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="flex items-center justify-center py-6 sm:py-10 md:py-14 hover:bg-white transition-colors group"
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#2036B8] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* Behance */}
                <a 
                  href="https://www.behance.net/keertharavicha1" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Behance"
                  title="Behance"
                  className="flex items-center justify-center py-6 sm:py-10 md:py-14 hover:bg-white transition-colors group"
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#2036B8] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 5.5v13" />
                    <path d="M4.5 5.5h4a3 3 0 0 1 0 6h-4" />
                    <path d="M4.5 11.5h4.5a3.5 3.5 0 0 1 0 7h-4.5" />
                    <path d="M13.5 7.5h5" />
                    <path d="M12.5 15h6a3 3 0 1 0-6 0c0 2 1.5 3.5 3.5 3.5 1.3 0 2.4-.6 3-1.6" />
                  </svg>
                </a>

                {/* Email */}
                <a 
                  href="mailto:itskeerthanaravichandran@gmail.com" 
                  aria-label="Email"
                  title="Email"
                  className="flex items-center justify-center py-6 sm:py-10 md:py-14 hover:bg-white transition-colors group"
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#2036B8] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/keerthanaravichandran/" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="flex items-center justify-center py-6 sm:py-10 md:py-14 hover:bg-white transition-colors group"
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#2036B8] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-10 lg:px-16 py-6 sm:py-8 text-[10.5px] sm:text-[12px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-accent font-medium">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <span className="whitespace-nowrap sm:whitespace-normal">© 2026 Keerthana Ravichandran</span>
              <span>Designed with Intention · Built with Care</span>
            </div>
          </footer>
        </div>
      </div>

      {/* RESUME MODAL */}
      {resumeOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex justify-center overflow-y-auto p-4 md:p-8 animate-in fade-in duration-200">
          <div className="relative bg-white text-[#14141F] border border-border rounded-2xl max-w-[850px] w-full my-auto shadow-2xl overflow-hidden p-6 md:p-10">
            <button
              onClick={() => setResumeOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full border border-border bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              title="Close Resume"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="border-b border-border pb-6">
              <h2 className="font-display text-4xl text-heading">Keerthana Ravichandran</h2>
              <p className="text-base text-muted mt-1">Senior Product Designer | US / Remote | hello@keerthana.design</p>
            </div>

            <div className="py-6 space-y-8">
              <div>
                <h3 className="font-display text-xl text-heading uppercase tracking-wider mb-4">Experience</h3>
                <div className="space-y-6">
                  <div className="border-l-2 border-accent pl-4">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-semibold text-fg">Lead Product Designer — Youtopia</h4>
                      <span className="text-xs text-muted">2023 — Present</span>
                    </div>
                    <p className="text-xs text-muted mt-1">0→1 AI Wellness Platform</p>
                    <p className="text-sm text-fg mt-2 leading-relaxed">
                      Led product strategy, design systems, and multi-agent interaction paradigms for an AI nutrition product. Reduced task friction by 25% and designed 40+ production UI components.
                    </p>
                  </div>

                  <div className="border-l-2 border-border pl-4">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-semibold text-fg">VR Product Designer — UMBC Imaging Research Center</h4>
                      <span className="text-xs text-muted">2022 — 2023</span>
                    </div>
                    <p className="text-xs text-muted mt-1">REVLR Spatial Accessibility</p>
                    <p className="text-sm text-fg mt-2 leading-relaxed">
                      Designed accessible gaze reticle controls and dynamic vignetting systems in VR, lowering cognitive load by 30% and increasing spatial task completion rates by 40%.
                    </p>
                  </div>

                  <div className="border-l-2 border-border pl-4">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-semibold text-fg">Senior Product Designer — Justickets</h4>
                      <span className="text-xs text-muted">2020 — 2022</span>
                    </div>
                    <p className="text-xs text-muted mt-1">High-Traffic Consumer Ticketing</p>
                    <p className="text-sm text-fg mt-2 leading-relaxed">
                      Redesigned mobile seat booking and checkout experience for over 1M users, boosting purchase funnel conversion by 18%.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl text-heading uppercase tracking-wider mb-3">Education & Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-neutral-50 border border-border rounded-lg">
                    <div className="font-semibold text-fg">M.S. Human-Centered Computing</div>
                    <div className="text-xs text-muted mt-1">University of Maryland, Baltimore County (UMBC)</div>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-border rounded-lg">
                    <div className="font-semibold text-fg">Core Capabilities</div>
                    <div className="text-xs text-muted mt-1">AI Systems, Spatial Computing (VR), Design Systems, Civic Tech</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex justify-between items-center">
              <button
                onClick={() => setResumeOpen(false)}
                className="px-5 py-2.5 rounded-full border border-border bg-neutral-100 text-xs font-medium hover:bg-neutral-200 transition-colors"
              >
                Close Resume
              </button>
              <a
                href="mailto:hello@keerthana.design"
                className="px-5 py-2.5 rounded-full bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}