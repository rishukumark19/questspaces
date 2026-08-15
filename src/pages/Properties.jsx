import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import ComparePropertiesModal from '../components/ComparePropertiesModal';

export default function Properties({ savedIds = [], onToggleSave, onOpenVIPModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, loading } = useProperties();

  // Layout View Mode (grid vs list)
  const [viewMode, setViewMode] = useState('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Property Comparison State
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // URL as Source of Truth
  const selectedLocation = searchParams.get('location') || 'All';
  const selectedDeveloper = searchParams.get('developer') || 'All';
  const selectedType = searchParams.get('type') || 'All';
  const selectedBhk = searchParams.get('bhk') || 'All';
  const selectedStatus = searchParams.get('status') || 'All';
  const selectedPossession = searchParams.get('possession') || 'All';
  const sortBy = searchParams.get('sort') || 'Default';
  const budgetParam = searchParams.get('budget') || '';

  // Local state for debounced inputs
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 1000);

  // Sync debounced inputs to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      
      if (searchQuery) nextParams.set('search', searchQuery);
      else nextParams.delete('search');

      if (maxPrice !== 1000) nextParams.set('maxPrice', maxPrice.toString());
      else nextParams.delete('maxPrice');

      const currentSearch = searchParams.get('search') || '';
      const currentMaxPrice = Number(searchParams.get('maxPrice')) || 1000;

      if (searchQuery !== currentSearch || maxPrice !== currentMaxPrice) {
        setSearchParams(nextParams, { replace: true });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, maxPrice, searchParams, setSearchParams]);

  // Update query params helper
  const updateParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === 'All' || val === '' || val === 'Any' || val === 'Default') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams, { replace: true });
  };

  // Compare handlers
  const handleToggleCompare = (property) => {
    setCompareList((prev) => {
      const exists = prev.some(p => p.id === property.id);
      if (exists) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length >= 4) {
        setToastMessage('You can compare up to 4 properties at a time.');
        setTimeout(() => setToastMessage(''), 3000);
        return prev;
      }
      return [...prev, property];
    });
  };

  const handleRemoveFromCompare = (id) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  // List of unique developers from current properties
  const developerOptions = useMemo(() => {
    const devs = new Set((properties || []).map(p => p.developer).filter(Boolean));
    return Array.from(devs);
  }, [properties]);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return (properties || []).filter((p) => {
      if (!p) return false;
      
      const matchesSearch = 
        !searchQuery ||
        (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.developer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.micromarket || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = selectedLocation === 'All' || 
        (p.micromarket || '').toLowerCase().includes(selectedLocation.toLowerCase()) || 
        (p.location || '').toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesDeveloper = selectedDeveloper === 'All' ||
        (p.developer || '').toLowerCase() === selectedDeveloper.toLowerCase();
      
      const matchesType = selectedType === 'All' || p.propertyType === selectedType;
      const matchesBhk = selectedBhk === 'All' || (p.bhkOptions && p.bhkOptions.includes(selectedBhk));
      const matchesStatus = selectedStatus === 'All' || (p.status || '').toLowerCase().includes(selectedStatus.toLowerCase());
      
      const matchesPossession = selectedPossession === 'All' || 
        (p.possession || '').toLowerCase().includes(selectedPossession.toLowerCase());

      // Budget presets
      let matchesBudgetParam = true;
      if (budgetParam === 'under-3cr') {
        matchesBudgetParam = p.priceValue <= 30000000;
      } else if (budgetParam === '1Cr-3Cr' || budgetParam === '3cr') {
        matchesBudgetParam = p.priceValue >= 10000000 && p.priceValue <= 30000000;
      } else if (budgetParam === '3Cr-5Cr' || budgetParam === '3cr-5cr') {
        matchesBudgetParam = p.priceValue >= 30000000 && p.priceValue <= 50000000;
      } else if (budgetParam === '5Cr-10Cr' || budgetParam === '5cr-10cr') {
        matchesBudgetParam = p.priceValue >= 50000000 && p.priceValue <= 100000000;
      } else if (budgetParam === '10Cr+' || budgetParam === '10cr+') {
        matchesBudgetParam = p.priceValue >= 100000000;
      }

      const matchesPrice = (!p.priceValue || maxPrice === 1000 || p.priceValue <= maxPrice * 100000) && matchesBudgetParam;

      return matchesSearch && matchesLocation && matchesDeveloper && matchesType && matchesBhk && matchesStatus && matchesPossession && matchesPrice;
    });
  }, [properties, searchQuery, selectedLocation, selectedDeveloper, selectedType, selectedBhk, selectedStatus, selectedPossession, budgetParam, maxPrice]);

  // Sort Logic
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      if (sortBy === 'Price: Low to High') return (a.priceValue || 0) - (b.priceValue || 0);
      if (sortBy === 'Price: High to Low') return (b.priceValue || 0) - (a.priceValue || 0);
      if (sortBy === 'Featured First') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'Name: A to Z') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });
  }, [filteredProperties, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setMaxPrice(1000);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Active filters array for quick pill tags
  const activeFilters = [];
  if (searchQuery) activeFilters.push({ label: `"${searchQuery}"`, key: 'search', onRemove: () => setSearchQuery('') });
  if (selectedLocation !== 'All') activeFilters.push({ label: selectedLocation, key: 'location', onRemove: () => updateParams({ location: 'All' }) });
  if (selectedDeveloper !== 'All') activeFilters.push({ label: selectedDeveloper, key: 'developer', onRemove: () => updateParams({ developer: 'All' }) });
  if (selectedType !== 'All') activeFilters.push({ label: selectedType, key: 'type', onRemove: () => updateParams({ type: 'All' }) });
  if (selectedBhk !== 'All') activeFilters.push({ label: selectedBhk, key: 'bhk', onRemove: () => updateParams({ bhk: 'All' }) });
  if (selectedStatus !== 'All') activeFilters.push({ label: selectedStatus, key: 'status', onRemove: () => updateParams({ status: 'All' }) });
  if (selectedPossession !== 'All') activeFilters.push({ label: `Possession: ${selectedPossession}`, key: 'possession', onRemove: () => updateParams({ possession: 'All' }) });
  if (budgetParam) activeFilters.push({ label: `Budget: ${budgetParam}`, key: 'budget', onRemove: () => updateParams({ budget: '' }) });
  if (maxPrice !== 1000) activeFilters.push({ label: `Max ₹${(maxPrice / 100).toFixed(1)} Cr`, key: 'maxPrice', onRemove: () => setMaxPrice(1000) });

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        
        {/* Header & Integrated Search */}
        <div className="mb-10 border-b border-outline-variant/30 pb-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="max-w-2xl">
              <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-2">Exclusive Portfolio</span>
              <h1 className="font-headline-lg text-3xl md:text-5xl font-bold text-primary mb-3">
                Curated Luxury Residences
              </h1>
              <p className="font-body-lg text-sm md:text-base text-on-surface-variant leading-relaxed">
                Discover elite residential enclaves across Bengaluru's high-appreciation corridors. Verified RERA compliance, developer credentials, and private site visit assistance.
              </p>
            </div>

            {/* View Mode Toggle & Comparison Quick Trigger */}
            <div className="flex items-center gap-3 shrink-0">
              {compareList.length > 0 && (
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="bg-secondary text-primary font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:bg-secondary/90 transition-all border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                  <span>Compare ({compareList.length})</span>
                </button>
              )}

              <div className="bg-surface-container border border-outline-variant/50 p-1 rounded-xl flex items-center shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                  title="Grid View"
                  aria-label="Switch to Grid View"
                >
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                  title="List View"
                  aria-label="Switch to List View"
                >
                  <span className="material-symbols-outlined text-[20px]">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <aside className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary text-[24px]">search</span>
                <input 
                  type="text"
                  placeholder="Search by property name, developer (e.g. L&T, Embassy), or locality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border-2 border-outline-variant/50 rounded-2xl py-4 pl-14 pr-6 text-sm md:text-base text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface-container text-on-surface-variant hover:text-primary flex items-center justify-center border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all border-none cursor-pointer ${isFiltersOpen ? 'bg-primary text-white shadow-md' : 'bg-surface-container-low text-primary border border-outline-variant/50 hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
                Filters {activeFilters.length > (searchQuery ? 1 : 0) ? `(${activeFilters.length - (searchQuery ? 1 : 0)})` : ''}
              </button>
            </div>

            {/* Collapsible Filter Panel */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFiltersOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm space-y-5 mt-2">
                {/* Quick Filters Row 1: Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
              
              {/* Location */}
              <select 
                value={selectedLocation}
                onChange={(e) => updateParams({ location: e.target.value })}
                className="bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-primary outline-none cursor-pointer hover:border-primary transition-colors shadow-sm"
              >
                <option value="All">All Locations</option>
                <option value="Hebbal">Hebbal</option>
                <option value="Yelahanka">Yelahanka</option>
                <option value="Manyata Tech Park">Manyata Tech Park</option>
                <option value="Devanahalli">Devanahalli</option>
                <option value="Thanisandra">Thanisandra</option>
                <option value="Whitefield">Whitefield</option>
              </select>

              {/* Developer */}
              <select 
                value={selectedDeveloper}
                onChange={(e) => updateParams({ developer: e.target.value })}
                className="bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-primary outline-none cursor-pointer hover:border-primary transition-colors shadow-sm"
              >
                <option value="All">All Developers</option>
                {developerOptions.map(dev => (
                  <option key={dev} value={dev}>{dev}</option>
                ))}
              </select>

              {/* Property Type */}
              <select 
                value={selectedType}
                onChange={(e) => updateParams({ type: e.target.value })}
                className="bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-primary outline-none cursor-pointer hover:border-primary transition-colors shadow-sm"
              >
                <option value="All">All Types</option>
                <option value="Luxury Apartment">Apartment</option>
                <option value="Modern Villa">Villa</option>
                <option value="Row House">Row House</option>
                <option value="Investment Plot">Investment Plot</option>
              </select>

              {/* Status */}
              <select 
                value={selectedStatus}
                onChange={(e) => updateParams({ status: e.target.value })}
                className="bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-primary outline-none cursor-pointer hover:border-primary transition-colors shadow-sm"
              >
                <option value="All">All Statuses</option>
                <option value="New Launch">New Launch</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Ready to Move In">Ready to Move</option>
                <option value="Pre-Launch">Pre-Launch</option>
              </select>

              {/* Possession */}
              <select 
                value={selectedPossession}
                onChange={(e) => updateParams({ possession: e.target.value })}
                className="bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-primary outline-none cursor-pointer hover:border-primary transition-colors shadow-sm"
              >
                <option value="All">All Possessions</option>
                <option value="Ready">Ready to Move</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029+</option>
              </select>

              {/* Reset button */}
              {activeFilters.length > 0 && (
                <button 
                  onClick={resetFilters}
                  className="ml-auto text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors px-3 py-2 border-none bg-transparent cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset
                </button>
              )}
            </div>

            {/* Quick Filters Row 2: BHK Chips & Budget Preset Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              
              {/* BHK Options */}
              <div className="flex items-center gap-1 bg-surface border border-outline-variant/50 p-1 rounded-xl shadow-sm flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-2.5">BHK:</span>
                {['All', '2 BHK', '3 BHK', '3.5 BHK', '4 BHK', '5+ BHK', 'Plots'].map((bhk) => (
                  <button
                    key={bhk}
                    type="button"
                    onClick={() => updateParams({ bhk })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                      selectedBhk === bhk 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    {bhk === 'All' ? 'Any' : bhk.replace(' BHK', '')}
                  </button>
                ))}
              </div>

              {/* Budget Quick Preset Chips */}
              <div className="flex items-center gap-1 bg-surface border border-outline-variant/50 p-1 rounded-xl shadow-sm flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-2.5">Budget:</span>
                {[
                  { label: 'Any', value: '' },
                  { label: '< ₹3 Cr', value: 'under-3cr' },
                  { label: '₹3–5 Cr', value: '3Cr-5Cr' },
                  { label: '₹5–10 Cr', value: '5Cr-10Cr' },
                  { label: '₹10 Cr+', value: '10Cr+' }
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => updateParams({ budget: b.value })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                      budgetParam === b.value 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              </div>

            </div>
          </div>

            {/* Active Filter Tags */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Active Filters:</span>
                {activeFilters.map(filter => (
                  <span 
                    key={filter.key}
                    className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    <span>{filter.label}</span>
                    <button 
                      onClick={filter.onRemove}
                      className="hover:text-red-600 transition-colors border-none bg-transparent cursor-pointer p-0 flex items-center"
                      aria-label={`Remove filter ${filter.label}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
                <button 
                  onClick={resetFilters}
                  className="text-xs font-bold text-secondary hover:underline ml-2 bg-transparent border-none cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

          </aside>
        </div>

        {/* Listings Section */}
        <section className="w-full">
          
          {/* Results Bar */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4 border-b border-outline-variant/20 pb-4">
            <p className="text-sm md:text-base text-on-surface-variant font-medium">
              Showing <span className="font-bold text-primary">{sortedProperties.length}</span> curated luxury residences
            </p>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-on-surface-variant uppercase font-bold tracking-wider">Sort By:</span>
              <select 
                aria-label="Sort properties by"
                value={sortBy}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="bg-surface border border-outline-variant/50 rounded-lg px-3 py-1.5 font-bold text-primary focus:border-primary cursor-pointer outline-none text-xs"
              >
                <option value="Default">Default Relevance</option>
                <option value="Featured First">Featured First</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Name: A to Z">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" : "space-y-6"}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <PropertyCardSkeleton key={n} />
              ))}
            </div>
          ) : sortedProperties.length === 0 ? (
            /* Empty State */
            <div className="text-center py-24 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm max-w-2xl mx-auto px-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-outline-variant/50">
                  <span className="material-symbols-outlined text-[48px] text-secondary">search_off</span>
                </div>
                <h3 className="text-3xl font-bold text-primary mb-3 font-headline-lg">No Properties Found</h3>
                <p className="text-sm md:text-base text-on-surface-variant mb-8 leading-relaxed max-w-md mx-auto">
                  We couldn't find any residences matching your exact filters. Try adjusting your budget, location, or property type.
                </p>
                <button 
                  onClick={resetFilters} 
                  className="bg-primary hover:bg-gray-800 text-white px-8 py-3.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md border-none cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            /* Properties Grid / List */
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" : "space-y-6"}>
              {sortedProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  isSaved={savedIds.includes(property.id) || savedIds.includes(property.slug)}
                  onToggleSave={onToggleSave}
                  onOpenVIPModal={onOpenVIPModal}
                  isComparing={compareList.some(p => p.id === property.id)}
                  onToggleCompare={handleToggleCompare}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

        </section>

      </main>

      {/* Floating Compare Dock (When items are selected) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-outline-variant/40 p-3 md:p-4 flex items-center gap-4 max-w-xl w-[90vw] animate-bounce-short">
          <div className="flex -space-x-3 overflow-hidden">
            {compareList.map((p) => (
              <img 
                key={p.id}
                src={p.heroImage || (p.images && p.images[0])} 
                alt={p.title}
                className="inline-block h-12 w-12 rounded-xl ring-2 ring-white object-cover shadow-sm"
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-primary truncate">
              {compareList.length} {compareList.length === 1 ? 'Property' : 'Properties'} Selected
            </h4>
            <p className="text-[11px] text-on-surface-variant truncate">
              {compareList.map(p => p.title).join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareList([])}
              className="text-xs font-bold text-on-surface-variant hover:text-red-600 px-2 py-1 bg-transparent border-none cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="bg-primary hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition-colors border-none cursor-pointer whitespace-nowrap"
            >
              Compare ({compareList.length}/4)
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <ComparePropertiesModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
        compareList={compareList} 
        onRemove={handleRemoveFromCompare} 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 text-white px-6 py-3 rounded-lg shadow-2xl text-sm font-label-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          {toastMessage}
        </div>
      )}

    </div>
  );
}
