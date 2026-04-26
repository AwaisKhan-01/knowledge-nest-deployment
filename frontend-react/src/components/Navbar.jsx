import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('kn_token')
  let userEmail = ''
  try {
    userEmail = JSON.parse(localStorage.getItem('kn_user') || '{}')?.email || ''
  } catch (e) {}

  const handleLogout = () => {
    localStorage.removeItem('kn_token')
    localStorage.removeItem('kn_user')
    toast.success("Successfully logged out!")
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-950">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-sm shadow-slate-950/10 transition group-hover:bg-slate-800">
            KN
          </span>
          KnowledgeNest
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/courses" className="transition-colors hover:text-indigo-600">Browse Courses</Link>
          {token ? (
            <div className="ml-2 flex items-center gap-4 border-l border-slate-200 pl-4">
              <span className="font-normal text-slate-500">
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
              <Link to="/login" className="px-4 py-2 font-semibold transition-colors hover:text-indigo-600">
                 Log in
              </Link>
              <Link to="/register">
                <button className="rounded-xl bg-slate-950 px-4 py-2 font-semibold text-white shadow-sm shadow-slate-950/10 transition hover:-translate-y-px hover:bg-slate-800 active:scale-95">
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
