import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 border-b border-indigo-500/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dcb40zsv9/image/upload/v1727787353/bg-pattern_b9gztj.png')] opacity-10 bg-repeat mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="max-w-7xl pt-24 pb-32 px-4 sm:px-6 lg:px-8 mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-sm">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-300">KnowledgeNest</span>
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto md:text-2xl font-light mb-10 tracking-wide font-sans">
            Your gateway to online learning excellence. Build the skills of tomorrow, faster, smarter, and interactively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/courses">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white font-bold rounded-lg shadow-xl shadow-indigo-900/20 transition-all duration-300 w-full sm:w-auto text-lg">
                Browse Full Catalog
              </button>
            </Link>
            <Link to="/register">
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 hover:border-slate-500 transition-all duration-300 shadow-lg w-full sm:w-auto text-lg hover:scale-105 active:scale-95">
                Join for Free
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Band (MLflow style logo request) */}
      <div className="border-b border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-8">Trusted by thousands of eager learners worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="text-2xl font-bold text-slate-800 font-serif flex items-center gap-2"><span className="text-indigo-600 text-3xl">⚡</span> TechCorp</span>
               <span className="text-2xl font-bold text-slate-800 font-serif flex items-center gap-2"><span className="text-teal-500 text-3xl">🌐</span> GlobalNet</span>
               <span className="text-2xl font-bold text-slate-800 font-serif flex items-center gap-2"><span className="text-orange-500 text-3xl">✨</span> InnovateIO</span>
               <span className="text-2xl font-bold text-slate-800 font-serif flex items-center gap-2"><span className="text-rose-500 text-3xl">🚀</span> FutureScale</span>
            </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Why Choose KnowledgeNest?</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Skip the theory craft. Get straight to practical, hands-on architectural skills built for the modern cloud landscape.</p>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="bg-indigo-50 w-16 h-16 rounded-xl flex items-center justify-center text-indigo-600 text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">📚</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Content</h3>
            <p className="text-slate-600 leading-relaxed">Access high-quality courses curated directly by industry-leading cloud architects and full-stack developers.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="bg-teal-50 w-16 h-16 rounded-xl flex items-center justify-center text-teal-600 text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Self-Paced Mastery</h3>
            <p className="text-slate-600 leading-relaxed">Study whenever and wherever you want. Our async microservices curriculum is designed for busy professionals.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="bg-orange-50 w-16 h-16 rounded-xl flex items-center justify-center text-orange-500 text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">⭐</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Community Vetted</h3>
            <p className="text-slate-600 leading-relaxed">Filter verified reviews, check comprehensive course ratings, and learn alongside a passionate global cohort.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
