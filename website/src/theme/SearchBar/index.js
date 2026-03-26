import React, { useState, useRef, useEffect, useCallback } from 'react';

const SUGGESTIONS = [
  'RAG architecture',
  'Solution Play 01',
  'Cost optimization',
  'Embeddings',
  'Azure AI Search',
  'DevKit setup',
];

/* ── Detect mobile (≤996px) using matchMedia ── */
function useIsMobile(breakpoint = 996) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setMobile(mq.matches);
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return mobile;
}

export default function SearchBarWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('menu'); // 'menu' | 'search'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchIndex, setSearchIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const btnRef = useRef(null);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });
  const isMobile = useIsMobile();

  // Load search index on first open — parse all 5 sections into flat searchable docs
  const loadIndex = useCallback(async () => {
    if (searchIndex) return searchIndex;
    setLoading(true);
    try {
      const resp = await fetch('/search-index.json');
      const raw = await resp.json();
      // raw is an array of sections: [pages, headers, descriptions, empty, content]
      // Build a flat array of searchable documents with proper URLs
      const pages = {};   // id → page-level doc (for parent lookups)
      const docs = [];
      const seen = new Set();

      // Section 0 — page-level (title + breadcrumbs)
      if (raw[0]?.documents) {
        for (const d of raw[0].documents) {
          pages[d.i] = d;
          const url = d.u || '';
          if (!seen.has(url)) {
            seen.add(url);
            docs.push({ title: d.t || '', url, breadcrumbs: Array.isArray(d.b) ? d.b.join(' › ') : '', body: '' });
          }
        }
      }

      // Section 1 — headers/subheaders (with #hash anchors)
      if (raw[1]?.documents) {
        for (const d of raw[1].documents) {
          const url = (d.u || '') + (d.h || '');
          const parent = pages[d.p];
          if (!seen.has(url)) {
            seen.add(url);
            docs.push({ title: d.t || '', url, breadcrumbs: parent ? (parent.t || '') : '', body: '' });
          }
        }
      }

      // Section 4 — body content (with #hash anchors)
      if (raw[4]?.documents) {
        for (const d of raw[4].documents) {
          const url = (d.u || '') + (d.h || '');
          // Attach body text to existing header entry or create new
          const existing = docs.find(e => e.url === url);
          if (existing) {
            existing.body = (existing.body ? existing.body + ' ' : '') + (d.t || '');
          } else {
            docs.push({ title: d.s || '', url, breadcrumbs: '', body: d.t || '' });
          }
        }
      }

      setSearchIndex(docs);
      setLoading(false);
      return docs;
    } catch {
      setLoading(false);
      return null;
    }
  }, [searchIndex]);

  // Search function — searches titles, breadcrumbs, and body content
  const doSearch = useCallback((q, index) => {
    if (!q || !index) return [];
    const lower = q.toLowerCase();
    const words = lower.split(/\s+/).filter(Boolean);
    const scored = [];
    for (const doc of index) {
      const title = (doc.title || '').toLowerCase();
      const body = (doc.body || '').toLowerCase();
      const crumbs = (doc.breadcrumbs || '').toLowerCase();
      let score = 0;
      for (const w of words) {
        if (title.includes(w)) score += 10;
        if (crumbs.includes(w)) score += 3;
        if (body.includes(w)) score += 1;
      }
      if (score > 0) {
        // Build excerpt from body around the first match
        let excerpt = '';
        if (body) {
          const idx = body.indexOf(words[0]);
          if (idx >= 0) {
            const start = Math.max(0, idx - 40);
            excerpt = (start > 0 ? '...' : '') + doc.body.substring(start, start + 140) + '...';
          } else {
            excerpt = doc.body.substring(0, 120) + '...';
          }
        }
        scored.push({ title: doc.title, url: doc.url, excerpt, score });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10);
  }, []);

  // ── OPEN: position dropdown and show it ──
  const doOpen = useCallback(async (openMode) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const mobile = window.innerWidth <= 996;
      setDropPos({
        top: rect.bottom + 6,
        right: mobile ? 8 : 8,
        width: mobile ? Math.min(280, window.innerWidth - 16) : 340,
      });
    }
    setMode(openMode);
    setIsOpen(true);
    if (openMode === 'search') {
      await loadIndex();
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [loadIndex]);

  // ── PILL CLICK: open if closed, do nothing if already open ──
  const handlePillClick = useCallback(() => {
    if (!isOpen) {
      doOpen(window.innerWidth <= 996 ? 'menu' : 'search');
    }
  }, [isOpen, doOpen]);

  // Handle typing
  const handleInput = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 0 && searchIndex) {
      setResults(doSearch(val, searchIndex));
    } else {
      setResults([]);
    }
  }, [searchIndex, doSearch]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) { setQuery(''); setResults([]); setMode('menu'); }
  }, [isOpen]);

  // Switch to search mode from within the ⚡ menu
  const openSearch = useCallback(async () => {
    setMode('search');
    await loadIndex();
    setTimeout(() => inputRef.current?.focus(), 120);
  }, [loadIndex]);

  // Listen for clicks on sidebar "Search FAI" link (href="#search-fai")
  useEffect(() => {
    const handler = (e) => {
      const link = e.target.closest('a[href*="search-fai"]');
      if (link) {
        e.preventDefault();
        e.stopPropagation();
        // Close sidebar first
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        if (closeBtn) closeBtn.click();
        // Force close any existing dropdown, then reopen fresh as search
        setIsOpen(false);
        setTimeout(() => {
          doOpen('search');
        }, 350); // Wait for sidebar animation to finish
      }
    };
    document.addEventListener('click', handler, true); // capture phase
    return () => document.removeEventListener('click', handler, true);
  }, [doOpen]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', order: 5 }}>
      {/* Single pill button — on mobile shows ⚡, on desktop shows 🔍 */}
      <button
        ref={btnRef}
        onClick={handlePillClick}
        aria-label={isMobile ? 'FAI Menu' : 'Search'}
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.08))',
          border: '1px solid rgba(124,58,237,0.4)',
          borderRadius: '10px',
          padding: '6px 16px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontWeight: 700,
          fontSize: '0.78rem',
          color: '#a78bfa',
          transition: 'all 0.3s ease',
          textShadow: '0 0 8px rgba(124,58,237,0.2)',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(167,139,250,0.15))';
          e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.3), 0 0 40px rgba(124,58,237,0.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.08))';
          e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'none';
        }}
      >
        {isMobile ? '⚡' : '🔍'}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropPos.top,
            right: dropPos.right,
            width: dropPos.width || 340,
            maxWidth: 'calc(100vw - 16px)',
            maxHeight: '460px',
            background: 'rgba(10,10,22,0.97)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(124,58,237,0.15)',
            backdropFilter: 'blur(16px)',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'searchDropIn 0.15s ease-out',
          }}
        >
          {/* ── Mobile menu mode ── */}
          {isMobile && mode === 'menu' && (
            <div style={{ padding: '10px 10px' }}>
              {/* Quick actions */}
              <a
                href="/hi-fai"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '10px', marginBottom: '6px',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06))',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10b981', fontWeight: 700, fontSize: '0.88rem',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>👋</span> Hi FAI
              </a>
              <a
                href="/chatbot"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '10px', marginBottom: '6px',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(234,179,8,0.06))',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#f59e0b', fontWeight: 700, fontSize: '0.88rem',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✨</span> FAI Agent
              </a>
              <button
                onClick={openSearch}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '12px 14px', borderRadius: '10px', marginBottom: '6px',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(167,139,250,0.06))',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: '#a78bfa', fontWeight: 700, fontSize: '0.88rem',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🔍</span> Search FAI
              </button>
              <a
                href="https://github.com/gitpavleenbali/frootai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(219,39,119,0.06))',
                  border: '1px solid rgba(236,72,153,0.3)',
                  color: '#ec4899', fontWeight: 700, fontSize: '0.88rem',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>📦</span> GitHub
              </a>
            </div>
          )}

          {/* ── Search mode (desktop always, mobile when selected) ── */}
          {(mode === 'search') && (
            <>
              {/* Back button on mobile */}
              {isMobile && (
                <button
                  onClick={() => setMode('menu')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', background: 'none', border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(167,139,250,0.6)', fontSize: '0.78rem',
                    cursor: 'pointer', width: '100%',
                  }}
                >
                  ← Back to menu
                </button>
              )}
              {/* Search input */}
              <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInput}
                  placeholder="Search FrootAI..."
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(124,58,237,0.25)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#e0e0e0',
                    fontSize: '0.88rem',
                    outline: 'none',
                    caretColor: '#a78bfa',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.25)'; }}
                />
              </div>

              {/* Content area */}
              <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px 0' }}>
                {loading && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(167,139,250,0.5)', fontSize: '0.82rem' }}>
                    Loading search index...
                  </div>
                )}

                {/* Suggestions when empty */}
                {!loading && query.length === 0 && (
                  <div style={{ padding: '8px 14px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                      Try searching for
                    </div>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); if (searchIndex) setResults(doSearch(s, searchIndex)); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          background: 'none', border: 'none', padding: '8px 10px',
                          color: 'rgba(167,139,250,0.6)', fontSize: '0.84rem',
                          cursor: 'pointer', borderRadius: '6px', transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.color = '#c4b5fd'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(167,139,250,0.6)'; }}
                      >
                        🔍 {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Results */}
                {!loading && query.length > 0 && results.length > 0 && results.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block', padding: '10px 14px', color: '#e0e0e0',
                      textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px' }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.3' }}>
                      {r.excerpt}...
                    </div>
                  </a>
                ))}

                {/* No results */}
                {!loading && query.length > 0 && results.length === 0 && (
                  <div style={{ padding: '20px 14px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.84rem' }}>
                    No results for "{query}"
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes searchDropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
