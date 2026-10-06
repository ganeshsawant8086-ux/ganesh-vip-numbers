import { useState, useMemo } from 'react';
import './App.css';
import { VIP_NUMBERS, CATEGORIES, CONTACT_INFO } from './vipData';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSum, setSelectedSum] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Custom request form state
  const [customReq, setCustomReq] = useState({
    name: '',
    digits: '',
    budget: 'Under ₹25,000',
    network: 'Any Network (Jio/Airtel/Vi)',
    notes: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const handleCopyNumber = (item) => {
    const textToCopy = item.isLot ? item.lotNumbers.join(' & ') : item.number;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    showToast(`Copied ${textToCopy} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCart = (item) => {
    const exists = cart.some((c) => c.id === item.id);
    if (exists) {
      setCart(cart.filter((c) => c.id !== item.id));
      showToast(`Removed from cart`);
    } else {
      setCart([...cart, item]);
      showToast(`Added to cart!`);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  const filteredNumbers = useMemo(() => {
    return VIP_NUMBERS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'lots') {
          if (!item.isLot) return false;
        } else if (item.tag !== selectedCategory) {
          return false;
        }
      }

      // Sum filter
      if (selectedSum !== 'all') {
        if (item.isLot) {
          if (!item.sum.includes(selectedSum)) return false;
        } else if (item.sum !== selectedSum) {
          return false;
        }
      }

      // Price filter
      if (priceFilter === 'under25k' && item.rawPrice > 25000) return false;
      if (priceFilter === '25k-75k' && (item.rawPrice < 25000 || item.rawPrice > 75000)) return false;
      if (priceFilter === '75k-150k' && (item.rawPrice < 75000 || item.rawPrice > 150000)) return false;
      if (priceFilter === 'above150k' && item.rawPrice < 150000) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const numberMatch = item.number.toLowerCase().includes(query);
        const catMatch = item.category.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const badgeMatch = item.badge.toLowerCase().includes(query);
        const lotMatch = item.lotNumbers?.some((n) => n.toLowerCase().includes(query));
        if (!numberMatch && !catMatch && !descMatch && !badgeMatch && !lotMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.rawPrice - b.rawPrice;
      if (sortBy === 'price-high') return b.rawPrice - a.rawPrice;
      if (sortBy === 'sum') return String(a.sum).localeCompare(String(b.sum));
      return 0; // featured default
    });
  }, [selectedCategory, selectedSum, priceFilter, searchQuery, sortBy]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.rawPrice, 0);
  }, [cart]);

  const handleBookSingle = (item) => {
    const text = `Hello Ganesh ji, I am interested in booking this VIP Number:
📱 Number: ${item.number}
🏷️ Category: ${item.category}
💰 Price: ${item.price}
Sum: ${item.sumDetails}

Please confirm availability and porting procedure.`;
    window.open(CONTACT_INFO.whatsappUrl(text), '_blank');
  };

  const handleBookCartWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map(
        (c, idx) =>
          `${idx + 1}. ${c.number} (${c.category}) - ${c.price}`
      )
      .join('\n');

    const message = `Hello Ganesh ji, I want to book these VIP numbers from your website:

${itemsList}

Total Items: ${cart.length}
Total Estimated Amount: ₹${cartTotal.toLocaleString('en-IN')}

Please share payment and porting (UPC) details.`;

    window.open(CONTACT_INFO.whatsappUrl(message), '_blank');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const msg = `Hello Ganesh ji, I am looking for a custom VIP number:
👤 Name: ${customReq.name || 'Customer'}
🎯 Desired Digits / Pattern: ${customReq.digits}
💰 Budget Range: ${customReq.budget}
📶 Preferred Operator: ${customReq.network}
📝 Additional Note: ${customReq.notes || 'None'}

Please check your inventory and share matching available VIP options!`;
    window.open(CONTACT_INFO.whatsappUrl(msg), '_blank');
  };

  const lotCount = VIP_NUMBERS.filter((n) => n.isLot).length;

  return (
    <div className="page-wrapper">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      {/* Top Banner Notice */}
      <div className="top-announcement">
        <span>⚡ 100% Genuine VIP Mobile Numbers & Matching Lots | 15-Minute UPC Guarantee</span>
        <a href={`tel:${CONTACT_INFO.phone}`} className="top-call-link">
          📞 Call Now: {CONTACT_INFO.phone}
        </a>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <a className="logo" href="#home">
          <div className="logo-icon-wrapper">
            <span className="logo-crown">👑</span>
            <span className="logo-letters">GS</span>
          </div>
          <div className="logo-text-block">
            <span className="logo-brand">GANESH VIP NUMBER</span>
            <span className="logo-sub">Pandharpur • All India Delivery</span>
          </div>
        </a>

        <ul className="menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#numbers">Attractive Numbers</a></li>
          <li><a href="#lots-showcase">VIP Lots & Pairs</a></li>
          <li><a href="#custom-req">Custom Order</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="nav-actions">
          <a
            href={CONTACT_INFO.whatsappUrl('Hello Ganesh ji, I want to inquire about VIP numbers.')}
            target="_blank"
            rel="noreferrer"
            className="nav-wa-btn"
          >
            <span className="wa-icon">💬</span>
            <span className="nav-wa-text">WhatsApp</span>
          </a>

          <button
            className="cart-btn"
            type="button"
            aria-label="Open cart"
            onClick={() => setIsCartOpen(true)}
          >
            <svg className="cart-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.5 6h15l-1.8 8.5H8.1L6.5 6Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M2.5 3.5h2.4L6.5 6" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="9" cy="19.5" r="1.5" fill="currentColor" />
              <circle cx="18" cy="19.5" r="1.5" fill="currentColor" />
            </svg>
            <span>Cart</span>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>

          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button
                className="close-drawer-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <ul className="mobile-nav-links">
              <li><a href="#home" onClick={() => setIsMobileMenuOpen(false)}>🏠 Home</a></li>
              <li><a href="#numbers" onClick={() => setIsMobileMenuOpen(false)}>⭐ Attractive Numbers</a></li>
              <li><a href="#lots-showcase" onClick={() => setIsMobileMenuOpen(false)}>👥 VIP Lots & Pairs</a></li>
              <li><a href="#custom-req" onClick={() => setIsMobileMenuOpen(false)}>✨ Custom Number Order</a></li>
              <li><a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>📋 How It Works</a></li>
              <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>📞 Contact & Support</a></li>
            </ul>
            <div className="mobile-nav-footer">
              <a href={`tel:${CONTACT_INFO.phone}`} className="mobile-nav-call">
                📞 Call: {CONTACT_INFO.phone}
              </a>
              <a
                href={CONTACT_INFO.whatsappUrl('Hello Ganesh ji, I want to inquire about VIP numbers.')}
                target="_blank"
                rel="noreferrer"
                className="mobile-nav-wa"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header id="home" className="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-pill">
            <span className="pulse-dot"></span> Premium Numbers & Matching Lots Available
          </div>
          <h1>
            Own an <span className="gold-gradient-text">Attractive VIP Number</span> That Commands Respect
          </h1>
          <p className="impressive-line">
            Elevate your prestige with Royal Pentas, 007 Agent Series, Lucky 786, and Exclusive Twin Lots.
            Direct dealing with Ganesh Sawant with zero commission and instant porting code.
          </p>

          <div className="hero-actions">
            <a href="#numbers" className="primary-cta-btn">
              <span>Explore All {VIP_NUMBERS.length} Numbers</span>
              <span className="btn-arrow">→</span>
            </a>
            <a href="#lots-showcase" className="secondary-cta-btn">
              <span>View Twin Lots ({lotCount} Available)</span>
            </a>
          </div>

          <div className="trust-strip">
            <div className="trust-item">
              <span className="trust-icon">✅</span>
              <div>
                <strong>100% Genuine Porting</strong>
                <span>All India Jio / Airtel / Vi / BSNL</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <div>
                <strong>Instant UPC Code</strong>
                <span>Quick transfer in 15 mins</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <div>
                <strong>Direct Owner Deal</strong>
                <span>No broker, best market price</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">📍</span>
              <div>
                <strong>Pandharpur Base</strong>
                <span>Serving Maharashtra & Pan India</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* VIP LOTS & TWIN PAIRS HIGHLIGHT SECTION */}
      <section id="lots-showcase" className="lots-banner-section">
        <div className="container">
          <div className="section-head-box">
            <div className="section-eyebrow">EXCLUSIVE LOTS & BUNDLES</div>
            <h2 className="section-title">VIP Lots & Matching Twin Pairs</h2>
            <p className="section-subtitle">
              Need paired VIP numbers for husband & wife, business partners, or corporate board members?
              Grab exclusive matching twin sets with identical prefixes and cadence!
            </p>
          </div>

          <div className="lots-grid">
            {VIP_NUMBERS.filter((n) => n.isLot).map((lot) => {
              const inCart = cart.some((c) => c.id === lot.id);
              return (
                <div key={lot.id} className="lot-card">
                  <div className="lot-badge-row">
                    <span className="lot-badge">{lot.badge}</span>
                    <span className="lot-stock-tag">⚡ {lot.status}</span>
                  </div>

                  <div className="lot-title-row">
                    <h3>{lot.category}</h3>
                    <span className="lot-sim-count">{lot.lotSize} SIM Set</span>
                  </div>

                  <div className="lot-numbers-container">
                    {lot.lotNumbers.map((numStr, i) => (
                      <div key={i} className="lot-single-row">
                        <span className="lot-sim-icon">SIM {i + 1}</span>
                        <span className="lot-digits">{numStr}</span>
                      </div>
                    ))}
                  </div>

                  <div className="lot-meta-row">
                    <span className="lot-sum-tag">Numerology: {lot.sumDetails}</span>
                  </div>

                  <p className="lot-desc">{lot.description}</p>

                  <div className="lot-pricing-box">
                    <div className="lot-price-left">
                      <span className="lot-price-label">Bundle Price:</span>
                      <div className="lot-price-wrap">
                        <span className="lot-price-val">{lot.price}</span>
                        <span className="lot-orig-val">{lot.originalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lot-actions">
                    <button
                      className="lot-wa-btn"
                      onClick={() => handleBookSingle(lot)}
                      type="button"
                    >
                      <span>Book Lot on WhatsApp</span>
                    </button>
                    <button
                      className={`lot-cart-btn ${inCart ? 'active' : ''}`}
                      onClick={() => toggleCart(lot)}
                      type="button"
                    >
                      {inCart ? 'In Cart ✓' : '+ Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ALL ATTRACTIVE NUMBERS SECTION WITH FILTERS */}
      <section id="numbers" className="container main-catalog-section">
        <div className="section-head-box">
          <div className="section-eyebrow">CURATED COLLECTION</div>
          <h2 className="section-title">Explore Attractive VIP Numbers</h2>
          <p className="section-subtitle">
            Browse through our extensive stock of rare VIP numbers. Search by your lucky digits,
            filter by budget or numerology sum, and book directly.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="filter-panel">
          <div className="search-bar-row">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search digits e.g. 999, 786, 007, 4321 or category..."
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="sort-wrap">
              <label htmlFor="sort-select" className="sort-label">Sort:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="featured">Featured / Best First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="sum">Numerology Sum</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-scroll-bar">
            {CATEGORIES.map((cat) => {
              const count = cat.id === 'all'
                ? VIP_NUMBERS.length
                : cat.id === 'lots'
                ? VIP_NUMBERS.filter((n) => n.isLot).length
                : VIP_NUMBERS.filter((n) => n.tag === cat.id).length;

              return (
                <button
                  key={cat.id}
                  className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                  <span className="cat-badge">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters (Sum & Price Range) */}
          <div className="secondary-filters-row">
            <div className="filter-group">
              <span className="filter-group-title">Numerology Sum:</span>
              <div className="sum-pills">
                {['all', '1', '5', '6', '7', '8', '9'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`sum-pill ${selectedSum === s ? 'active' : ''}`}
                    onClick={() => setSelectedSum(s)}
                  >
                    {s === 'all' ? 'All Sums' : `Sum ${s}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-group-title">Price Range:</span>
              <div className="price-pills">
                {[
                  { id: 'all', label: 'All Budgets' },
                  { id: 'under25k', label: 'Under ₹25k' },
                  { id: '25k-75k', label: '₹25k - ₹75k' },
                  { id: '75k-150k', label: '₹75k - ₹1.5L' },
                  { id: 'above150k', label: '₹1.5L+' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`sum-pill ${priceFilter === p.id ? 'active' : ''}`}
                    onClick={() => setPriceFilter(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="results-counter-bar">
          <span>Showing <strong>{filteredNumbers.length}</strong> attractive numbers matching your criteria</span>
          {(searchQuery || selectedCategory !== 'all' || selectedSum !== 'all' || priceFilter !== 'all') && (
            <button
              className="reset-filters-btn"
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSum('all');
                setPriceFilter('all');
                setSearchQuery('');
                setSortBy('featured');
              }}
            >
              Reset All Filters ↺
            </button>
          )}
        </div>

        {/* Cards Grid */}
        {filteredNumbers.length === 0 ? (
          <div className="no-results-box">
            <div className="no-results-icon">🔎</div>
            <h3>No VIP numbers found matching your query</h3>
            <p>Try searching different digits or reset your filters to view all numbers.</p>
            <button
              className="primary-cta-btn"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSum('all');
                setPriceFilter('all');
                setSearchQuery('');
              }}
            >
              Show All Numbers
            </button>
          </div>
        ) : (
          <div className="vip-cards-grid">
            {filteredNumbers.map((item) => {
              const inCart = cart.some((c) => c.id === item.id);
              const isCopied = copiedId === item.id;

              return (
                <div key={item.id} className={`vip-card ${item.isLot ? 'is-lot-card' : ''}`}>
                  <div className="card-top-strip">
                    <span className="card-badge">{item.badge}</span>
                    <span className="card-status">⚡ {item.status}</span>
                  </div>

                  <div className="card-category-name">{item.category}</div>

                  {/* Main Digits Box */}
                  <div className="number-display-box">
                    {item.isLot ? (
                      <div className="lot-stacked-digits">
                        {item.lotNumbers.map((num, idx) => (
                          <div key={idx} className="lot-mini-row">
                            <span className="lot-dot">●</span>
                            <span className="num-text">{num}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="num-text single-num">{item.number}</div>
                    )}

                    <button
                      className="copy-btn"
                      onClick={() => handleCopyNumber(item)}
                      title="Copy Number"
                      type="button"
                      aria-label="Copy number"
                    >
                      {isCopied ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>

                  {/* Numerology and Details */}
                  <div className="card-attributes">
                    <div className="attr-pill sum-attr">
                      <span className="attr-icon">🔮</span>
                      <span>Sum: <strong>{item.sum}</strong> ({item.sumDetails})</span>
                    </div>
                    <div className="attr-pill operator-attr">
                      <span className="attr-icon">📶</span>
                      <span>Port to Jio / Airtel / Vi / BSNL</span>
                    </div>
                  </div>

                  <p className="card-description">{item.description}</p>

                  {/* Pricing Box */}
                  <div className="card-pricing-row">
                    <div>
                      <div className="price-tag-wrap">
                        <span className="current-price">{item.price}</span>
                        {item.originalPrice && (
                          <span className="original-price">{item.originalPrice}</span>
                        )}
                      </div>
                      <span className="inclusive-tag">All India Porting Included</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-btn-row">
                    <button
                      className="wa-action-btn"
                      onClick={() => handleBookSingle(item)}
                      type="button"
                    >
                      <span className="btn-icon">💬</span>
                      <span>Book on WhatsApp</span>
                    </button>

                    <button
                      className={`cart-action-btn ${inCart ? 'in-cart' : ''}`}
                      onClick={() => toggleCart(item)}
                      type="button"
                      aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
                      title={inCart ? 'Remove from cart' : 'Add to cart'}
                    >
                      {inCart ? '✓' : '+'}
                    </button>

                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="call-action-btn"
                      title="Direct Call"
                      aria-label="Call directly"
                    >
                      📞
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CUSTOM NUMBER REQUEST / INQUIRY FORM */}
      <section id="custom-req" className="custom-req-section">
        <div className="container">
          <div className="custom-card-wrapper">
            <div className="custom-left-info">
              <span className="section-eyebrow gold">SPECIAL REQUIREMENT?</span>
              <h2>Looking for a Specific VIP Number or Date of Birth?</h2>
              <p>
                Can't find your desired number in our ready stock? We can arrange custom numbers
                matching your Date of Birth, vehicle registration plate, lucky numerology sum,
                or 4-digit repeating combinations directly from authorized circles.
              </p>
              <div className="custom-benefits">
                <div>✨ Custom Birth Year (e.g. ending in 1995, 2000, 2004)</div>
                <div>✨ Car Match Series (e.g. 0001, 0009, 9999, 8055)</div>
                <div>✨ Personalised Numerology Consultation</div>
                <div>✨ 24-48 Hours Sourcing Guarantee</div>
              </div>
            </div>

            <form className="custom-form" onSubmit={handleCustomSubmit}>
              <h3>Send Custom Request</h3>
              <div className="form-group">
                <label htmlFor="user-name">Your Name</label>
                <input
                  id="user-name"
                  type="text"
                  placeholder="e.g. Rajesh Patil"
                  value={customReq.name}
                  onChange={(e) => setCustomReq({ ...customReq, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-digits">Desired Digits / Pattern</label>
                <input
                  id="user-digits"
                  type="text"
                  placeholder="e.g. 786 at end, or ending 0007, or DOB 1996"
                  value={customReq.digits}
                  onChange={(e) => setCustomReq({ ...customReq, digits: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user-budget">Budget Range</label>
                  <select
                    id="user-budget"
                    value={customReq.budget}
                    onChange={(e) => setCustomReq({ ...customReq, budget: e.target.value })}
                  >
                    <option value="Under ₹25,000">Under ₹25,000</option>
                    <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="Above ₹1,00,000">Above ₹1,00,000</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="user-network">Preferred Operator</label>
                  <select
                    id="user-network"
                    value={customReq.network}
                    onChange={(e) => setCustomReq({ ...customReq, network: e.target.value })}
                  >
                    <option value="Any Network">Any (Jio/Airtel/Vi/BSNL)</option>
                    <option value="Jio">Jio 5G</option>
                    <option value="Airtel">Airtel 5G</option>
                    <option value="Vi">Vodafone Idea (Vi)</option>
                    <option value="BSNL">BSNL</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="user-notes">Additional Details (Optional)</label>
                <input
                  id="user-notes"
                  type="text"
                  placeholder="Any particular prefix or preference..."
                  value={customReq.notes}
                  onChange={(e) => setCustomReq({ ...customReq, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="custom-submit-btn">
                <span>💬 Submit & Chat on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="info-section">
        <div className="info-content">
          <div className="section-head-box light">
            <div className="section-eyebrow gold">SIMPLE PROCESS</div>
            <h2 className="section-title">How To Buy Your VIP Number in 3 Steps</h2>
            <p>
              Ganesh VIP Number provides 100% legal, genuine, and transparent MNP (Mobile Number Portability)
              services across Pandharpur and entire India.
            </p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Choose & Confirm</h3>
              <p>
                Select your favorite VIP number or Twin Lot from our catalog. Click "Book on WhatsApp"
                to verify live availability with Ganesh Sawant.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Receive Official UPC</h3>
              <p>
                Complete quick payment and receive your official Unique Porting Code (UPC) and
                bill directly via SMS and WhatsApp within 15 to 30 minutes.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Activate With Any SIM</h3>
              <p>
                Visit your nearest Jio, Airtel, Vi, or BSNL store or book doorstep delivery. Show your
                UPC code and Aadhaar card — your new VIP SIM activates seamlessly!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & ABOUT DETAILS */}
      <section id="contact" className="container contact-section">
        <div className="section-head-box">
          <div className="section-eyebrow">GET IN TOUCH</div>
          <h2 className="section-title">Direct Contact with Ganesh Sawant</h2>
          <p className="section-subtitle">
            Deal directly with the owner for genuine numbers, best discount rates, and instant support.
          </p>
        </div>

        <div className="contact-card-premium">
          <div className="contact-profile-box">
            <div className="owner-avatar">GS</div>
            <div>
              <h3>Ganesh Sawant</h3>
              <span className="owner-title">Founder & VIP Number Specialist</span>
              <p className="owner-location">📍 Pandharpur City, Solapur District, Maharashtra</p>
            </div>
          </div>

          <div className="contact-methods-grid">
            <div className="c-item">
              <span className="c-icon">📞</span>
              <div>
                <span className="c-label">Direct Phone Call</span>
                <a href={`tel:${CONTACT_INFO.phone}`} className="c-val">{CONTACT_INFO.phoneFormatted}</a>
              </div>
            </div>

            <div className="c-item">
              <span className="c-icon">💬</span>
              <div>
                <span className="c-label">WhatsApp Helpline</span>
                <a
                  href={CONTACT_INFO.whatsappUrl('Hello Ganesh ji, I want to inquire about VIP numbers.')}
                  target="_blank"
                  rel="noreferrer"
                  className="c-val"
                >
                  +91 {CONTACT_INFO.phone} (Instant Reply)
                </a>
              </div>
            </div>

            <div className="c-item">
              <span className="c-icon">⏰</span>
              <div>
                <span className="c-label">Operating Hours</span>
                <span className="c-val-text">{CONTACT_INFO.supportHours}</span>
              </div>
            </div>

            <div className="c-item">
              <span className="c-icon">🌐</span>
              <div>
                <span className="c-label">Delivery Scope</span>
                <span className="c-val-text">Pandharpur, Pune, Mumbai & All India Porting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-left">
            <div className="logo-text-block">
              <span className="footer-brand">👑 GANESH VIP NUMBER</span>
              <p>Premium VIP Mobile Numbers, Numerology Kings, and Matching Lots.</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#numbers">Attractive Numbers</a>
            <a href="#lots-showcase">VIP Lots</a>
            <a href="#custom-req">Custom Order</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Ganesh VIP Numbers. All rights reserved. Managed by Ganesh Sawant, Pandharpur.</p>
          </div>
        </div>
      </footer>

      {/* SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <div className="cart-title-row">
                <span className="cart-header-icon">🛒</span>
                <h3>Your Selected Numbers</h3>
                <span className="cart-count-pill">{cart.length}</span>
              </div>
              <button
                className="close-drawer-btn"
                onClick={() => setIsCartOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="cart-body">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <span className="empty-cart-icon">🛒</span>
                  <h4>Your cart is empty</h4>
                  <p>Browse our attractive numbers and click "+ Add" to build your VIP collection!</p>
                  <button
                    className="primary-cta-btn"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Browse Numbers
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-card">
                      <div className="cart-item-info">
                        <span className="cart-item-cat">{item.category}</span>
                        <strong className="cart-item-number">{item.number}</strong>
                        <span className="cart-item-sum">Sum: {item.sum} ({item.sumDetails})</span>
                        <div className="cart-item-price">{item.price}</div>
                      </div>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove"
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-row">
                  <span>Total Selected:</span>
                  <span>{cart.length} {cart.length === 1 ? 'Number' : 'Numbers'}</span>
                </div>
                <div className="cart-summary-row total-row">
                  <span>Total Est. Price:</span>
                  <span className="total-amount">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="cart-actions-column">
                  <button
                    className="cart-checkout-btn"
                    onClick={handleBookCartWhatsApp}
                    type="button"
                  >
                    <span>💬 Book All {cart.length} via WhatsApp</span>
                  </button>
                  <button
                    className="cart-clear-btn"
                    onClick={clearCart}
                    type="button"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP BUTTON (ALWAYS ACCESSIBLE) */}
      <a
        href={CONTACT_INFO.whatsappUrl('Hello Ganesh ji, I want to ask about your available VIP Numbers and Lots.')}
        target="_blank"
        rel="noreferrer"
        className="floating-wa-btn"
        aria-label="Chat with Ganesh Sawant on WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className="wa-icon-svg">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.17 8.17 0 0 1-1.25-4.47c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3Z" />
          </svg>
        </span>
        <span className="floating-wa-label">WhatsApp Ganesh</span>
      </a>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="mobile-bottom-bar">
        <a href={`tel:${CONTACT_INFO.phone}`} className="mob-bar-item call">
          <span>📞 Call Now</span>
        </a>
        <a
          href={CONTACT_INFO.whatsappUrl('Hello Ganesh ji, I want to buy a VIP number.')}
          target="_blank"
          rel="noreferrer"
          className="mob-bar-item whatsapp"
        >
          <span>💬 WhatsApp</span>
        </a>
        <button
          className="mob-bar-item cart"
          onClick={() => setIsCartOpen(true)}
          type="button"
        >
          <span>🛒 Cart ({cart.length})</span>
        </button>
      </div>
    </div>
  );
}

export default App;
