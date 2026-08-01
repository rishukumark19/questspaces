import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PROPERTIES } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

export default function Properties({ savedIds, onToggleSave, onOpenVIPModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedBhk, setSelectedBhk] = useState(searchParams.get('bhk') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Default');
  const [maxPrice, setMaxPrice] = useState(400); // Up to 4.0 Cr
  
  // Sync state with URL params
  useEffect(() => {
    setSelectedLocation(searchParams.get('location') || 'All');
    setSearchQuery(searchParams.get('search') || '');
    setSelectedType(searchParams.get('type') || 'All');
    setSelectedBhk(searchParams.get('bhk') || 'All');
    setSortBy(searchParams.get('sort') || 'Default');
  }, [searchParams]);

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
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    updateParams({
      search: searchQuery,
      location: selectedLocation,
      type: selectedType,
      bhk: selectedBhk,
      sort: sortBy
    });
  };

  // Filter Logic
  const filteredProperties = PROPERTIES.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.micromarket.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = selectedLocation === 'All' || 
      p.micromarket.toLowerCase().includes(selectedLocation.toLowerCase()) || 
      p.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    const matchesType = selectedType === 'All' || p.propertyType === selectedType;
    const matchesBhk = selectedBhk === 'All' || p.bhkOptions.includes(selectedBhk);
    
    // Parse starting price numeric value (e.g. ₹3.32 Cr* -> 33200000)
    const matchesPrice = !p.priceValue || p.priceValue <= maxPrice * 100000;

    return matchesSearch && matchesLocation && matchesType && matchesBhk && matchesPrice;
  });

  // Sort Logic
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.priceValue - b.priceValue;
    if (sortBy === 'Price: High to Low') return b.priceValue - a.priceValue;
    return 0;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setSelectedType('All');
    setSelectedBhk('All');
    setSortBy('Default');
    setMaxPrice(400);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        
        {/* Hero Title Section */}
        <section className="mt-8 mb-12 text-center">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Premium Apartments in Bangalore
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Explore exclusive high-end living spaces across Bangalore's most sought-after micromarkets, from ready-to-move-in luxury to upcoming iconic landmarks.
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-gutter">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="bg-surface-container-low p-6 rounded-xl filter-shadow lg:sticky lg:top-28">
              
              <div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-4">
                <span className="material-symbols-outlined text-primary">filter_list</span>
                <h2 className="font-headline-sm text-headline-sm text-primary">Filter Search</h2>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-6">
                <div>
                  <label className="block font-label-bold text-label-bold mb-2 uppercase text-on-surface-variant">Keyword</label>
                  <input 
                    type="text"
                    placeholder="Property name, builder..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block font-label-bold text-label-bold mb-2 uppercase text-on-surface-variant">Location</label>
                  <select 
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      updateParams({ location: e.target.value });
                    }}
                    className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md text-on-surface outline-none cursor-pointer"
                  >
                    <option value="All">Bangalore (All)</option>
                    <option value="Hebbal">Hebbal</option>
                    <option value="Yelahanka">Yelahanka</option>
                    <option value="Manyata Tech Park">Manyata Tech Park</option>
                    <option value="Devanahalli">Devanahalli</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-bold text-label-bold mb-2 uppercase text-on-surface-variant">Property Type</label>
                  <select 
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      updateParams({ type: e.target.value });
                    }}
                    className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md text-on-surface outline-none cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Luxury Apartment">Apartment</option>
                    <option value="Modern Villa">Villa</option>
                    <option value="Row House">Row House</option>
                    <option value="Investment Plot">Investment Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-bold text-label-bold mb-2 uppercase text-on-surface-variant">Configurations</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['All', '3 BHK', '3.5 BHK', '4 BHK'].map((bhk) => (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => {
                          setSelectedBhk(bhk);
                          updateParams({ bhk });
                        }}
                        className={`p-2 border border-outline-variant rounded text-xs font-semibold transition-colors ${
                          selectedBhk === bhk 
                            ? 'bg-primary text-white' 
                            : 'bg-surface hover:bg-surface-container'
                        }`}
                      >
                        {bhk === 'All' ? 'Any' : bhk.replace(' BHK', '')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-label-bold text-label-bold uppercase text-on-surface-variant">Price Range</label>
                    <span className="text-label-sm text-secondary font-bold">Up to ₹{maxPrice === 400 ? '4.00 Cr+' : (maxPrice / 100).toFixed(2) + ' Cr'}</span>
                  </div>
                  <input 
                    type="range"
                    min="100"
                    max="400"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={resetFilters}
                    className="w-1/3 border border-outline-variant text-primary font-label-bold text-label-bold py-4 uppercase tracking-wider rounded-lg hover:bg-surface-container transition-colors flex justify-center items-center cursor-pointer"
                  >
                    Reset
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white font-label-bold text-label-bold py-4 uppercase tracking-widest rounded-lg hover:shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer border-none"
                  >
                    Find Property
                    <span className="material-symbols-outlined text-[18px]">search</span>
                  </button>
                </div>
              </form>

            </div>
          </aside>

          {/* Listings Grid Column */}
          <section className="w-full lg:w-3/4">
            
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
                    setSortBy(e.target.value);
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

            {sortedProperties.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
                <span className="material-symbols-outlined text-[54px] text-secondary/30 mb-4 block">location_away</span>
                <h3 className="text-headline-sm font-bold text-primary mb-2">No Properties Found</h3>
                <p className="text-sm text-on-surface-variant mb-6">We couldn't find matches. Try adjusting your search keywords or price bounds.</p>
                <button onClick={resetFilters} className="bg-primary text-white px-6 py-3 font-label-bold text-label-bold uppercase rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
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

        </div>

      </main>
    </div>
  );
}
