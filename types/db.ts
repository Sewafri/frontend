export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN"

export type CourseStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED"
export type PricingModel = "FREE" | "ONE_TIME_PURCHASE" | "SUBSCRIPTION_ONLY"
export type ContentType = "TEXT" | "VIDEO" | "MIXED" | "CODE"
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED"
export type CertificateStatus = "ISSUED" | "REVOKED"
export type AnchorStatus = "PENDING_ANCHOR" | "ANCHORED" | "FAILED"
export type PaymentMethod = "CARD" | "CRYPTO"
export type PaymentStatus = "PENDING" | "AWAITING_CONFIRMATIONS" | "CONFIRMED" | "FAILED" | "EXPIRED" | "UNDERPAID" | "REFUNDED"
export type BillingInterval = "MONTHLY" | "ANNUAL"
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "PAST_DUE"
export type NotificationType = "THREAD_REPLY" | "ANSWER_ACCEPTED" | "NEW_MESSAGE" | "CERTIFICATE_ISSUED" | "PAYMENT_CONFIRMED" | "PAYMENT_FAILED" | "SUBSCRIPTION_PAST_DUE" | "CONTENT_REPORTED"
export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE"

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  isActive: boolean
  bio?: string | null
  photoUrl?: string | null
  expertise?: string | null
  walletAddress?: string | null
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  coverImageUrl?: string | null
  status: CourseStatus
  pricingModel: PricingModel
  price: number
  currency: string
  skillTags: string[]
  publishedAt?: string | null
  instructorId: string
  instructor?: { id: string; fullName: string; email: string }
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  title: string
  orderIndex: number
  contentType: ContentType
  contentBody?: string | null
  videoUrl?: string | null
  isRequired: boolean
  language?: string | null
  starterCode?: string | null
  courseId: string
  createdAt: string
  updatedAt: string
}

export type CodeLanguage = "javascript" | "typescript" | "python" | "html" | "css" | "jsx" | "tsx"

export interface Quiz {
  id: string
  title: string
  passingScore: number
  isFinalAssessment: boolean
  maxAttempts: number
  durationMinutes: number | null
  requireFullscreen: boolean
  courseId: string
  lessonId?: string | null
  questions?: QuizQuestion[]
  createdAt: string
  updatedAt: string
}

export interface QuizQuestion {
  id: string
  text: string
  type: QuestionType
  orderIndex: number
  points: number
  quizId: string
  answerOptions: AnswerOption[]
}

// Shape returned by GET /quizzes/:id (no isCorrect on options, includes settings)
export interface QuizSession {
  id: string
  title: string
  passingScore: number
  isFinalAssessment: boolean
  maxAttempts: number
  durationMinutes: number | null
  requireFullscreen: boolean
  attemptsUsed: number
  questions: QuizSessionQuestion[]
}

export interface QuizSessionQuestion {
  id: string
  text: string
  type: QuestionType
  points: number
  orderIndex: number
  answerOptions: QuizSessionOption[]
}

export interface QuizSessionOption {
  id: string
  text: string
}

export interface AnswerOption {
  id: string
  text: string
  isCorrect: boolean
  questionId: string
}

export interface QuizAttempt {
  id: string
  score: number
  passed: boolean
  attemptNumber: number
  answers: Record<string, string>
  integrityReport?: IntegrityReport | null
  userId: string
  quizId: string
  submittedAt: string
}

export interface IntegrityReport {
  tabSwitches: IntegrityEvent[]
  fullscreenExits: IntegrityEvent[]
  copyAttempts: IntegrityEvent[]
  pasteAttempts: IntegrityEvent[]
  navigationAttempts: IntegrityEvent[]
  totalTabSwitches: number
  totalFullscreenExits: number
}

export interface IntegrityEvent {
  type: string
  timestamp: string
  detail?: string
}

export interface Enrollment {
  id: string
  enrolledAt: string
  progressPercent: number
  status: EnrollmentStatus
  completedAt?: string | null
  userId: string
  courseId: string
  course?: Course
  createdAt: string
  updatedAt: string
}

export interface BlockchainRecord {
  id: string
  network: string
  txHash: string | null
  tokenId: string | null
  contractAddress: string
  anchorStatus: AnchorStatus
  anchoredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Certificate {
  id: string
  certificateNumber: string
  studentName: string
  courseTitle: string
  issuerName: string
  issueDate: string
  certificateHash: string
  status: CertificateStatus
  qrCodeUrl?: string | null
  enrollmentId: string
  createdAt: string
  updatedAt: string
  blockchainRecord?: BlockchainRecord | null
}

export type VerifyResult =
  | { result: "VALID"; studentName: string; courseTitle: string; issuerName: string; issueDate: string; anchorStatus: AnchorStatus | null; txHash: string | null; tokenId: string | null; network: string | null }
  | { result: "INVALID"; reason?: string }
  | { result: "REVOKED" }

export interface Payment {
  id: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  gatewayReference?: string | null
  userId: string
  createdAt: string
  confirmedAt?: string | null
  updatedAt: string
}

export interface ForumThread {
  id: string
  title: string
  isPinned: boolean
  isLocked: boolean
  courseId: string
  authorId: string
  author?: { id: string; fullName: string }
  lessonId?: string | null
  postCount?: number
  createdAt: string
  updatedAt: string
}

export interface ForumPost {
  id: string
  body: string
  isAcceptedAnswer: boolean
  isHidden: boolean
  threadId: string
  authorId: string
  author?: { id: string; fullName: string }
  upvoteCount?: number
  createdAt: string
  editedAt?: string | null
  updatedAt: string
}

export interface Notification {
  id: string
  type: NotificationType
  payload: Record<string, unknown>
  isRead: boolean
  userId: string
  createdAt: string
}

export interface Subscription {
  id: string
  status: SubscriptionStatus
  startedAt: string
  currentPeriodEnd: string
  autoRenew: boolean
  userId: string
  planId: string
  plan?: SubscriptionPlan
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: BillingInterval
  isActive: boolean
  features: string[]
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  createdAt: string
  lastMessageAt: string
  participants: ConversationParticipant[]
  messages?: Message[]
}

export interface ConversationParticipant {
  conversationId: string
  userId: string
  joinedAt: string
  user?: { id: string; fullName: string }
}

export interface Message {
  id: string
  body: string
  isRead: boolean
  sentAt: string
  conversationId: string
  senderId: string
  sender?: { id: string; fullName: string }
}
