import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPropertyStats, getAllProperties, validateForPublish } from '../../lib/properties';
import { getAllLeads } from '../../lib/leads';
import supabase from '../../lib/supabase';
import useDocumentTitle from '../hooks/useDocumentTitle';

const MOTIVATIONAL_QUOTES = [
  "Your next lead could arrive any moment.",
  "Great listings attract great buyers.",
  "Real estate is about creating experiences.",
  "Every draft is a potential closed deal.",
  "Stay proactive, stay ahead."
];

export default function AdminDashboard() {
  useDocumentTitle('Dashboard');

  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [leadsToday, setLeadsToday] = useState(0);
  const [leadsMonth, setLeadsMonth] = useState(0);
  const [closedLeads, setClosedLeads] = useState(0);
  const [contactedLeads, setContactedLeads] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  
  const [incompleteDrafts, setIncompleteDrafts] = useState([]);
  const [incompleteDraftsTotal, setIncompleteDraftsTotal] = useState(0);
  const [hideNeedsAttention, setHideNeedsAttention] = useState(sessionStorage.getItem('hideNeedsAttention') === 'true');
  
  const [activityTimeline, setActivityTimeline] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Set greeting and quote
    const hour = new Date().getHours();
    let timeGreeting = 'Good evening';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    
    // Attempt to get user name
    const setWelcome = async () => {
      try {
        if (supabase) {
          const { data } = await supabase.auth.getUser();
          const name = data?.user?.user_metadata?.full_name || data?.user?.user_metadata?.name || 'Admin';
          setGreeting(`Welcome back, ${name}. Here's your summary for today.`);
        } else {
          setGreeting(`Welcome back, Admin. Here's your summary for today.`);
        }
      } catch {
        setGreeting(`Welcome back, Admin. Here's your summary for today.`);
      }
    };
    
    setWelcome();
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

    // Fetch data
    const fetchDashboardData = async () => {
      try {
        const [statsData, draftsData, allLeadsData] = await Promise.all([
          getPropertyStats(),
          getAllProperties({ publishState: 'draft' }),
          getAllLeads()
        ]);
        
        setStats(statsData);
        
        // Process leads
        setTotalLeads(allLeadsData.length);
        const newLeads = allLeadsData.filter(l => l.status === 'New');
        const contacted = allLeadsData.filter(l => l.status === 'Contacted');
        const closed = allLeadsData.filter(l => l.status === 'Closed');
        
        setContactedLeads(contacted.length);
        setClosedLeads(closed.length);
        setRecentLeads(newLeads.slice(0, 5));
        
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        setLeadsToday(allLeadsData.filter(l => new Date(l.created_at) >= startOfDay).length);
        setLeadsMonth(allLeadsData.filter(l => new Date(l.created_at) >= startOfMonth).length);

        // Process incomplete drafts
        const allIncomplete = draftsData
          .map(draft => {
            const validation = validateForPublish(draft);
            return { ...draft, validation };
          })
          .filter(draft => !draft.validation.valid);
          
        setIncompleteDraftsTotal(allIncomplete.length);
        setIncompleteDrafts(allIncomplete.slice(0, 3));

        // Generate Activity Timeline
        const allProperties = await getAllProperties(); // We need all properties for this
        const activities = [];
        
        // Leads actvities
        allLeadsData.slice(0, 10).forEach(lead => {
          activities.push({
            id: `lead_${lead.id}`,
            type: 'lead',
            title: `New Inquiry from ${lead.name}`,
            subtitle: lead.property_title || 'General Inquiry',
            date: new Date(lead.created_at),
            icon: 'person_raised_hand',
            color: 'bg-emerald-100 text-emerald-600'
          });
        });
        
        // Property activities
        allProperties.slice(0, 10).forEach(prop => {
          activities.push({
            id: `prop_${prop.id}`,
            type: 'property',
            title: prop.publish_state === 'published' ? 'Property Published' : 'Property Drafted',
            subtitle: prop.title,
            date: new Date(prop.updated_at || prop.created_at),
            icon: prop.publish_state === 'published' ? 'public' : 'edit_document',
            color: prop.publish_state === 'published' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
          });
        });
        
        // Sort by date desc and take top 5
        activities.sort((a, b) => b.date - a.date);
        setActivityTimeline(activities.slice(0, 5));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto font-body-md animate-pulse">
        <div className="h-32 bg-slate-200 rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-36 bg-slate-100 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-48 bg-slate-100 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-100 rounded-2xl"></div>
              <div className="h-64 bg-slate-100 rounded-2xl"></div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="h-[400px] bg-slate-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Published Listings', value: stats?.published || 0, icon: 'public', color: 'bg-emerald-500/10 text-emerald-600', link: '/admin/properties?publishState=published', subtitle: 'Live on website' },
    { label: 'Unpublished Drafts', value: stats?.drafts || 0, icon: 'edit_document', color: 'bg-amber-500/10 text-amber-600', link: '/admin/properties?publishState=draft', subtitle: 'Needs review' },
    { label: 'New Inquiries', value: leadsToday, icon: 'mark_email_unread', color: 'bg-blue-500/10 text-blue-600', link: '/admin/leads?status=New', subtitle: 'Today' },
    { label: 'Total Leads', value: leadsMonth, icon: 'groups', color: 'bg-purple-500/10 text-purple-600', link: '/admin/leads', subtitle: 'This month' },
    { label: 'Closed Leads', value: closedLeads, icon: 'task_alt', color: 'bg-slate-500/10 text-slate-600', link: '/admin/leads?status=Closed', subtitle: 'All time' },
  ];

  const getTimeAgo = (dateStr) => {
    const hours = (new Date() - new Date(dateStr)) / (1000 * 60 * 60);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-8 max-w-7xl mx-auto font-body-md">
      {/* Welcome & Context Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 bg-primary text-white rounded-3xl p-8 shadow-md">
        <div>
          <div className="text-primary-100 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            {todayStr}
          </div>
          <h1 className="font-headline-md font-bold text-3xl md:text-4xl">{greeting}</h1>
        </div>
        <Link 
          to="/admin/properties/new" 
          className="inline-flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#D8B56F] hover:scale-95 text-black px-6 py-2.5 rounded-lg font-extrabold text-sm transition-all duration-150 shadow-sm cursor-pointer border-none shrink-0"
        >
          <span className="material-symbols-outlined text-[20px] font-bold text-black">add</span>
          <span className="text-black font-extrabold">Add Property</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map(stat => (
          <Link key={stat.label} to={stat.link} className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col hover:border-primary hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
              </div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider leading-tight">{stat.label}</div>
            </div>
            <div className="font-headline-md font-bold text-4xl text-slate-900 group-hover:text-primary transition-colors">{stat.value}</div>
            <div className={`mt-3 text-xs font-semibold text-slate-400`}>
              {stat.subtitle}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Nudges & Quick Actions) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Property Completion Nudges */}
          {!hideNeedsAttention && incompleteDrafts.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline-md font-bold text-xl text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">warning</span>
                  Needs Attention ({incompleteDraftsTotal})
                </h2>
                <button 
                  onClick={() => {
                    setHideNeedsAttention(true);
                    sessionStorage.setItem('hideNeedsAttention', 'true');
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  Hide for now
                </button>
              </div>
              <div className="space-y-3">
                {incompleteDrafts.map(draft => (
                  <div key={draft.id} className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-amber-500 mt-0.5">error</span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm mb-1">"{draft.title}" is missing details</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {draft.validation.missing.map(m => (
                            <span key={m} className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase tracking-wider">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Link 
                      to={`/admin/properties/${draft.id}/edit`}
                      className="shrink-0 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      Complete it &rarr;
                    </Link>
                  </div>
                ))}
                {incompleteDraftsTotal > 3 && (
                  <div className="text-center mt-2">
                    <Link to="/admin/properties" className="text-xs font-bold text-primary hover:underline">
                      View all {incompleteDraftsTotal} drafts
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Health & Funnel Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Lead Funnel Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">filter_alt</span>
                Lead Conversion Funnel
              </h3>
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div className="relative">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">New Inquiries</span>
                    <span className="text-slate-900">{totalLeads - contactedLeads - closedLeads}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: totalLeads ? `${((totalLeads - contactedLeads - closedLeads) / totalLeads) * 100}%` : '0%' }}></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Contacted</span>
                    <span className="text-slate-900">{contactedLeads}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: totalLeads ? `${(contactedLeads / totalLeads) * 100}%` : '0%' }}></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Successfully Closed</span>
                    <span className="text-slate-900">{closedLeads}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: totalLeads ? `${(closedLeads / totalLeads) * 100}%` : '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Listing Health */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">monitor_heart</span>
                Portfolio Health
              </h3>
              <div className="flex-1 flex items-center justify-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Published Segment */}
                    <path className="text-emerald-500 transition-all duration-1000" strokeDasharray={`${(stats?.published / (stats?.published + stats?.drafts || 1)) * 100 || 0}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-center flex flex-col items-center">
                    <span className="text-3xl font-bold text-slate-900 leading-none">{stats?.published || 0}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Live</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Published</span>
                    <span className="text-slate-900">{stats?.published || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-amber-300"></span>Drafts</span>
                    <span className="text-slate-900">{stats?.drafts || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-red-400"></span>Incomplete</span>
                    <span className="text-slate-900">{incompleteDraftsTotal}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="font-headline-md font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">bolt</span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/admin/properties" className="flex flex-col items-center justify-center p-6 bg-white border border-outline-variant/30 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-[24px]">list</span>
                </div>
                <div className="font-bold text-slate-800 text-sm">Manage Listings</div>
              </Link>
              
              <Link to="/admin/leads" className="flex flex-col items-center justify-center p-6 bg-white border border-outline-variant/30 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-emerald-500/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-emerald-600 text-[24px]">inbox</span>
                </div>
                <div className="font-bold text-slate-800 text-sm">View Leads</div>
              </Link>

              <Link to="/" target="_blank" className="flex flex-col items-center justify-center p-6 bg-white border border-outline-variant/30 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-blue-500/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-blue-600 text-[24px]">open_in_new</span>
                </div>
                <div className="font-bold text-slate-800 text-sm">Live Website</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (Recent Inquiries & Activity) */}
        <div className="space-y-8">
          
          {/* Recent Inquiries */}
          <div>
            <h2 className="font-headline-md font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500">notifications_active</span>
              Recent Inquiries
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col h-full max-h-[400px]">
              {recentLeads.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                    <span className="material-symbols-outlined text-3xl">task_alt</span>
                  </div>
                  <h3 className="font-bold text-slate-700 text-base mb-1">All Caught Up!</h3>
                  <p className="text-sm text-slate-500">All recent inquiries have been handled. Great work.</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {recentLeads.map(lead => (
                      <div key={lead.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-slate-900 text-sm line-clamp-1">{lead.name}</div>
                          <div className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 whitespace-nowrap ml-2" title={new Date(lead.created_at).toLocaleString()}>
                            {getTimeAgo(lead.created_at)}
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">apartment</span>
                          <span className="truncate font-semibold text-slate-800">{lead.property_title || 'General Inquiry'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/leads?id=${lead.id}`} className="flex-1 text-center py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">visibility</span> View Details
                          </Link>
                          <a href={`tel:${lead.phone}`} className="flex-1 text-center py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">call</span> Call
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <Link to="/admin/leads" className="block text-center text-sm font-bold text-primary hover:underline">
                      View All Inquiries
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <h2 className="font-headline-md font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">history</span>
              Recent Activity
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
              {activityTimeline.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-4">No recent activity</div>
              ) : (
                <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                  {activityTimeline.map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.color} ring-4 ring-white`}>
                        <span className="material-symbols-outlined text-[16px]">{activity.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{activity.title}</div>
                        <div className="text-xs text-slate-600 truncate mt-0.5">{activity.subtitle}</div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
                          {getTimeAgo(activity.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
