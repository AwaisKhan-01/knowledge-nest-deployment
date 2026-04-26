import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('kn_token')
  let userEmail = ""
  try {
      userEmail = JSON.parse(localStorage.getItem('kn_user') || '{}')?.email || ""
  } catch(e) {}

  const handleLogout = () => {
    localStorage.removeItem('kn_token')
    localStorage.removeItem('kn_user')
    toast.success("Successfully logged out!")
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link to="/" className="flex items-center text-2xl font-bold tracking-tight text-slate-900 group">
          <span className="bg-primary-600 text-white rounded bg-indigo-600 p-1 mr-2 text-xl drop-shadow-sm group-hover:bg-indigo-500 transition-colors">🎓</span>
          KnowledgeNest
        </Link>
        <div className="flex gap-6 items-center flex-row font-medium text-sm text-slate-600">
          <Link to="/courses" className="hover:text-indigo-600 transition-colors">Browse Courses</Link>
          {token ? (
            <div className="flex items-center gap-4 ml-2 border-l border-slate-200 pl-4">
              <span className="text-slate-500 font-normal">
                {userEmail}
              </span>
              <button onClick={handleLogout} className="px-4 py-2 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors active:scale-95 duration-200 shadow-sm">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2 border-l border-slate-200 pl-4">
              <Link to="/login" className="px-4 py-2 hover:text-indigo-600 font-semibold transition-colors">
                 Log in
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 hover:-translate-y-px transition-all font-semibold active:scale-95 duration-200 shadow-indigo-200">
                  Join for Free
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
