import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';

export default function Properties({ savedIds, onToggleSave, onOpenVIPModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, loading } = useProperties();
  
  // URL as Source of Truth
  const selectedLocation = searchParams.get('location') || 'All';
  const selectedType = searchParams.get('type') || 'All';
  const selectedBhk = searchParams.get('bhk') || 'All';
  const sortBy = searchParams.get('sort') || 'Default';
  
  // Local state for debounced inputs (to prevent stuttering)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 1000);
  const selectedStatus = searchParams.get('status') || 'All';

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

  // Update query params helper for instant dropdowns
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

  // Filter Logic (Reads strictly from current derived state)
  const filteredProperties = (properties || []).filter((p) => {
    if (!p) return false;
    const matchesSearch = 
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.developer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.micromarket || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = selectedLocation === 'All' || 
      (p.micromarket || '').toLowerCase().includes(selectedLocation.toLowerCase()) || 
      (p.location || '').toLowerCase().includes(selectedLocation.toLowerCase());
    
    const matchesType = selectedType === 'All' || p.propertyType === selectedType;
    const matchesBhk = selectedBhk === 'All' || (p.bhkOptions && p.bhkOptions.includes(selectedBhk));
    const matchesStatus = selectedStatus === 'All' || (p.status || '').toLowerCase().includes(selectedStatus.toLowerCase());
    
    // Parse starting price numeric value (e.g. ₹3.32 Cr* -> 33200000)
    const matchesPrice = !p.priceValue || p.priceValue <= maxPrice * 100000;

    return matchesSearch && matchesLocation && matchesType && matchesBhk && matchesStatus && matchesPrice;
  });

  // Sort Logic
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.priceValue - b.priceValue;
    if (sortBy === 'Price: High to Low') return b.priceValue - a.priceValue;
    return 0;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setMaxPrice(1000);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        
        {/* Header & Integrated Search */}
        <div className="mb-12 border-b border-outline-variant/30 pb-10 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div className="max-w-2xl">
              <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-3">Property Directory</span>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
                Premium Residences
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Explore exclusive high-end living spaces across Bangalore's most sought-after micromarkets, from ready-to-move-in luxury to upcoming iconic landmarks.
              </p>
            </div>
          </div>

          <aside className="w-full">
            {/* Main Search Bar */}
            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-primary text-[28px]">search</span>
              <input 
                type="text"
                placeholder="Search by property name, builder, or micromarket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border-2 border-outline-variant/60 rounded-full py-5 pl-16 pr-6 text-body-lg text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Quick Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              
              <select 
                value={selectedLocation}
                onChange={(e) => updateParams({ location: e.target.value })}
                className="bg-surface-container-lowest border border-outline-variant/50 rounded-full px-5 py-2.5 text-sm font-semibold text-primary outline-none cursor-pointer hover:bg-surface-container transition-colors shadow-sm"
              >
                <option value="All">Location: All</option>
                <option value="Hebbal">Hebbal</option>
                <option value="Yelahanka">Yelahanka</option>
                <option value="Manyata Tech Park">Manyata Tech Park</option>
                <option value="Devanahalli">Devanahalli</option>
              </select>

              <select 
                value={selectedType}
                onChange={(e) => updateParams({ type: e.target.value })}
                className="bg-surface-container-lowest border border-outline-variant/50 rounded-full px-5 py-2.5 text-sm font-semibold text-primary outline-none cursor-pointer hover:bg-surface-container transition-colors shadow-sm"
              >
                <option value="All">Type: All</option>
                <option value="Luxury Apartment">Apartment</option>
                <option value="Modern Villa">Villa</option>
                <option value="Row House">Row House</option>
                <option value="Investment Plot">Investment Plot</option>
              </select>

              <select 
                value={selectedStatus}
                onChange={(e) => updateParams({ status: e.target.value })}
                className="bg-surface-container-lowest border border-outline-variant/50 rounded-full px-5 py-2.5 text-sm font-semibold text-primary outline-none cursor-pointer hover:bg-surface-container transition-colors shadow-sm"
              >
                <option value="All">Status: All</option>
                <option value="New Launch">New Launch</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Ready to Move In">Ready to Move</option>
                <option value="Pre-Launch">Pre-Launch</option>
              </select>

              <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/50 p-1 rounded-full shadow-sm">
                {['All', '3 BHK', '3.5 BHK', '4 BHK'].map((bhk) => (
                  <button
                    key={bhk}
                    type="button"
                    onClick={() => updateParams({ bhk })}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      selectedBhk === bhk 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    {bhk === 'All' ? 'Any BHK' : bhk.replace(' BHK', '')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/50 px-5 py-2.5 rounded-full min-w-[200px] flex-1 lg:flex-none shadow-sm">
                <span className="text-xs font-bold text-primary whitespace-nowrap">Max: ₹{maxPrice === 1000 ? '10.00+ Cr' : (maxPrice / 100).toFixed(2) + ' Cr'}</span>
                <input 
                  type="range"
                  min="100" max="1000" step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary outline-none"
                />
              </div>

              <button 
                onClick={resetFilters}
                className="ml-auto text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline px-4 py-3"
              >
                Reset Filters
              </button>

            </div>
          </aside>
        </div>

          {/* Listings Grid Column */}
          <section className="w-full">
            
            <div className="flex justify-between items-end mb-8 flex-wrap gap-4 border-b border-outline-variant/30 pb-4">
              <p className="text-body-md text-on-surface-variant font-medium">
                <span className="font-bold text-primary">{sortedProperties.length}</span> Premium Residences Found
              </p>
              <div className="flex items-center gap-2 text-label-sm">
                <span className="text-on-surface-variant uppercase font-label-bold">Sort By:</span>
                <select 
                  aria-label="Sort properties by"
                  value={sortBy}
                  onChange={(e) => {
                    updateParams({ sort: e.target.value });
                  }}
                  className="border-none bg-transparent font-bold text-primary focus:ring-0 cursor-pointer outline-none text-xs"
                >
                  <option value="Default">Default Relevance</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <PropertyCardSkeleton key={n} />
                ))}
              </div>
            ) : sortedProperties.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
                <span className="material-symbols-outlined text-[54px] text-secondary/30 mb-4 block">location_away</span>
                <h3 className="text-headline-sm font-bold text-primary mb-2">No Properties Found</h3>
                <p className="text-sm text-on-surface-variant mb-6">We couldn't find matches. Try adjusting your search keywords or price bounds.</p>
                <button onClick={resetFilters} className="bg-primary text-white px-6 py-3 font-label-bold text-label-bold uppercase rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {sortedProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    isSaved={savedIds.includes(property.id)}
                    onToggleSave={onToggleSave}
                    onOpenVIPModal={onOpenVIPModal}
                  />
                ))}
              </div>
            )}

          </section>

      </main>
    </div>
  );
}
