import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { courseAPI, reviewAPI } from '../utils/api'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolling, setEnrolling] = useState(null)
  const [unenrolling, setUnenrolling] = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState(new Set())
  const [reviewForm, setReviewForm] = useState({
    courseId: null,
    rating: 5,
    comment: '',
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews, setReviews] = useState({})
  const [showReviews, setShowReviews] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    content_url: '',
  })
  const [creating, setCreating] = useState(false)

  const token = localStorage.getItem('kn_token')
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('kn_user') || '{}')
    } catch {
      return {}
    }
  }, [])

  useEffect(() => {
    fetchCourses()
    if (token) {
      fetchEnrollments()
    }
  }, [token])

  const fetchCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await courseAPI.getAll()
      setCourses(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to load courses.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrollments = async () => {
    try {
      const response = await courseAPI.getEnrollments()
      const enrolledIds = new Set((response.data || []).map((enrollment) => enrollment.course_id))
      setEnrolledCourses(enrolledIds)
    } catch (err) {
      console.error('Failed to load enrollments', err)
    }
  }

  const handleEnroll = async (courseId) => {
    if (!token) {
      toast.error('Please sign in to enroll.')
      return
    }

    setEnrolling(courseId)
    try {
      await courseAPI.enroll(courseId)
      toast.success('Enrollment confirmed.')
      setEnrolledCourses((prev) => new Set([...prev, courseId]))
    } catch (err) {
      const message = err.response?.data?.error || 'Enrollment failed.'
      toast.error(message)
    } finally {
      setEnrolling(null)
    }
  }

  const handleUnenroll = async (courseId) => {
    if (!token) {
      toast.error('Please sign in first.')
      return
    }

    if (!window.confirm('Remove this course from your enrollments?')) {
      return
    }

    setUnenrolling(courseId)
    try {
      await courseAPI.unenroll(courseId)
      toast.success('You have been unenrolled.')
      setEnrolledCourses((prev) => {
        const next = new Set(prev)
        next.delete(courseId)
        return next
      })
    } catch (err) {
      const message = err.response?.data?.error || 'Unenrollment failed.'
      toast.error(message)
    } finally {
      setUnenrolling(null)
    }
  }

  const isEnrolled = (courseId) => enrolledCourses.has(courseId)

  const openReviewForm = (courseId) => {
    if (!token) {
      toast.error('Please sign in to write a review.')
      return
    }

    setReviewForm({ courseId, rating: 5, comment: '' })
    setShowReviewForm(true)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Please sign in to submit a review.')
      return
    }

    try {
      await reviewAPI.create(reviewForm.courseId, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      })
      toast.success('Review published.')
      setShowReviewForm(false)
      setReviewForm({ courseId: null, rating: 5, comment: '' })
      setReviews((prev) => ({ ...prev, [reviewForm.courseId]: null }))
      setShowReviews((prev) => ({ ...prev, [reviewForm.courseId]: true }))
      fetchReviews(reviewForm.courseId)
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to submit review.'
      toast.error(message)
    }
  }

  const fetchReviews = async (courseId) => {
    try {
      const response = await reviewAPI.getByCourse(courseId)
      setReviews((prev) => ({ ...prev, [courseId]: response.data || [] }))
      setShowReviews((prev) => ({ ...prev, [courseId]: true }))
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to load reviews.'
      toast.error(message)
    }
  }

  const toggleReviews = (courseId) => {
    if (showReviews[courseId]) {
      setShowReviews((prev) => ({ ...prev, [courseId]: false }))
      return
    }

    if (!reviews[courseId]) {
      fetchReviews(courseId)
      return
    }

    setShowReviews((prev) => ({ ...prev, [courseId]: true }))
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Please sign in to create a course.')
      return
    }

    if (!createForm.title.trim()) {
      toast.error('Course title is required.')
      return
    }

    setCreating(true)
    try {
      await courseAPI.create({
        title: createForm.title,
        description: createForm.description,
        content_url: createForm.content_url,
      })
      toast.success('Course created.')
      setShowCreateForm(false)
      setCreateForm({ title: '', description: '', content_url: '' })
      fetchCourses()
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create course.'
      toast.error(message)
    } finally {
      setCreating(false)
    }
  }

  const CourseSkeleton = () => (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-4 w-24 rounded-full bg-slate-200" />
      <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />
      <div className="mt-3 space-y-2">
        <div className="h-3 rounded bg-slate-100" />
        <div className="h-3 rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="h-10 rounded-xl bg-slate-100" />
        <div className="h-10 rounded-xl bg-slate-100" />
        <div className="h-10 rounded-xl bg-slate-100" />
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Courses</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Browse premium cloud and software engineering content, manage enrollments, and share feedback from a calm, modern workspace.
            </p>
            {token && user?.email && (
              <p className="mt-3 text-sm text-slate-500">
                Signed in as <span className="font-medium text-slate-800">{user.email}</span>
              </p>
            )}
          </div>

          {token && (
            <button
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
              onClick={() => setShowCreateForm(true)}
            >
              + Create course
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-sm">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-900">No courses available yet.</p>
            <p className="mt-2 text-sm text-slate-500">Once the backend sync completes, new courses will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const enrolled = isEnrolled(course.id)
              const courseReviews = reviews[course.id]
              const reviewCount = Array.isArray(courseReviews) ? courseReviews.length : null

              return (
                <article
                  key={course.id}
                  className={`group rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    enrolled ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Course {course.id}
                      </span>
                      {enrolled && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Enrolled
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{course.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{course.description || 'No description provided for this course yet.'}</p>

                  {course.content_url && (
                    <a
                      href={course.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
                    >
                      View content
                    </a>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {enrolled ? (
                      <button
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                        onClick={() => handleUnenroll(course.id)}
                        disabled={unenrolling === course.id || !token}
                      >
                        {unenrolling === course.id ? 'Removing...' : 'Unenroll'}
                      </button>
                    ) : (
                      <button
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrolling === course.id || !token}
                      >
                        {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                      </button>
                    )}

                    <button
                      className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                      onClick={() => openReviewForm(course.id)}
                      disabled={!token}
                    >
                      Review
                    </button>

                    <button
                      className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      onClick={() => toggleReviews(course.id)}
                    >
                      {showReviews[course.id] ? 'Hide reviews' : 'Show reviews'}
                    </button>
                  </div>

                  {showReviews[course.id] && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Reviews
                        </h4>
                        <span className="text-sm text-slate-500">
                          {reviewCount !== null ? `${reviewCount} total` : 'Loading...'}
                        </span>
                      </div>

                      {Array.isArray(courseReviews) && courseReviews.length === 0 ? (
                        <p className="text-sm text-slate-500">No reviews yet. Be the first to share your experience.</p>
                      ) : Array.isArray(courseReviews) ? (
                        <div className="space-y-3">
                          {courseReviews.map((review) => (
                            <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-slate-900">{'★'.repeat(review.rating)}</span>
                                <span className="text-xs text-slate-500">
                                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                                </span>
                              </div>
                              {review.comment && <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                        </div>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>

      {showCreateForm && (
        <Modal title="Create course" onClose={() => setShowCreateForm(false)}>
          <form onSubmit={handleCreateCourse} className="space-y-5">
            <Field label="Course title *">
              <input
                type="text"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="Enter course title"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                required
              />
            </Field>

            <Field label="Description">
              <textarea
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                rows="4"
                placeholder="Enter course description"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </Field>

            <Field label="Content URL (optional)">
              <input
                type="url"
                value={createForm.content_url}
                onChange={(e) => setCreateForm({ ...createForm, content_url: e.target.value })}
                placeholder="https://example.com/course-content"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {creating ? 'Creating...' : 'Create course'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showReviewForm && (
        <Modal title="Write a review" onClose={() => setShowReviewForm(false)}>
          <form onSubmit={handleReviewSubmit} className="space-y-5">
            <Field label="Rating (1-5)">
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value, 10) })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </Field>

            <Field label="Comment">
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows="4"
                placeholder="Share your thoughts about this course"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Submit review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">KnowledgeNest</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Courses
