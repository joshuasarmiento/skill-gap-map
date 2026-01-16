<template>
  <div class="min-h-screen bg-slate-950 pt-32 pb-20 px-8 flex justify-center">
    <div class="max-w-4xl">
      <div class="text-center mb-16">
        <h1 class="text-6xl font-black text-white mb-6 uppercase tracking-tighter">
          The <span class="text-blue-500">Methodology</span>
        </h1>
        <p class="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Turning thousands of scattered job postings into a clear roadmap for the Philippine workforce.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-colors">
          <div class="text-blue-500 mb-4">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-white font-bold uppercase text-sm mb-3 tracking-widest">Market Scanning</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            Our system acts as a digital census, "reading" through thousands of public job advertisements across 88 regions to see who is hiring.
          </p>
        </div>

        <div class="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-colors">
          <div class="text-blue-500 mb-4">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-white font-bold uppercase text-sm mb-3 tracking-widest">Smart Grouping</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            We organize data by district. For Metro Manila, we combine city data to provide a "big picture" view of our capital's economic pulse.
          </p>
        </div>

        <div class="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-colors">
          <div class="text-blue-500 mb-4">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-white font-bold uppercase text-sm mb-3 tracking-widest">Skill Spotting</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            We identify over 200 specific skills—from Management to Software—to show exactly what qualifications are most valued by employers.
          </p>
        </div>
      </div>

      <div class="space-y-10">
        <div class="prose prose-invert max-w-none">
          <h2 class="text-3xl font-black text-white uppercase tracking-tight mb-4 text-center md:text-left">Bridging the Gap</h2>
          <p class="text-lg text-slate-400 leading-relaxed">
            Traditional labor reports often take months to release. <span class="text-white font-bold">Skill-Gap PH</span> provides a real-time snapshot of the market. By observing what companies are actually hiring for, we help students, workers, and leaders make data-driven decisions about their future.
          </p>
        </div>

        

        <div class="bg-linear-to-br from-blue-600/20 to-slate-900 p-10 rounded-[2.5rem] border border-blue-500/20">
          <h3 class="text-blue-400 font-bold uppercase mb-8 text-[10px] tracking-[0.4em]">Our Data Reach</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="border-l border-blue-500/30 pl-4">
              <p class="text-3xl font-black text-white">88</p>
              <p class="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">Provinces</p>
            </div>
            <div class="border-l border-blue-500/30 pl-4">
              <p class="text-3xl font-black text-white">200+</p>
              <p class="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">Job Skills</p>
            </div>
            <div class="border-l border-blue-500/30 pl-4">
              <p class="text-3xl font-black text-white">Active</p>
              <p class="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">Market Snapshots</p>
            </div>
            <div class="border-l border-blue-500/30 pl-4">
              <p class="text-3xl font-black text-white">Public</p>
              <p class="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">Information</p>
            </div>
          </div>
        </div>

        <div class="p-8 border-t border-slate-900/50">
           <p class="text-xs text-slate-600 leading-relaxed max-w-2xl">
            <strong class="text-slate-500 uppercase tracking-tighter mr-2">Privacy & Ethics:</strong> 
            This tool exclusively analyzes public-facing job advertisements to identify market trends. We do not track individuals, personal resumes, or private corporate data.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>