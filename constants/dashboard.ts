import type { LucideIcon } from "lucide-react";
import {
  BookOpen, Award, Clock, ScrollText,
  Users, DollarSign, Star, TrendingUp,
} from "lucide-react";

// ── Shared Types ──

export interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export interface CourseCard {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  category: string;
}

export interface Deadline {
  id: string;
  title: string;
  course: string;
  date: string;
  type: "assignment" | "quiz" | "project";
  urgent: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  excerpt: string;
  course: string;
  date: string;
}

export interface CoursePerformance {
  id: string;
  title: string;
  students: number;
  trend: number;
  trendUp: boolean;
}

export interface PendingTask {
  id: string;
  title: string;
  count: number;
}

export interface Activity {
  id: string;
  text: string;
  timestamp: string;
  type: "enrollment" | "course" | "review" | "payment";
}

export interface TopInstructor {
  id: string;
  name: string;
  specialty: string;
  students: number;
  rating: number;
  rank: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledDate: string;
  coursesCount: number;
  status: "Active" | "Inactive";
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface Certificate {
  id: string;
  courseName: string;
  completionDate: string;
  downloadUrl: string;
}

// ── Student Dashboard ──

export const STUDENT_STATS: StatItem[] = [
  { label: "Enrolled Courses", value: "8", icon: BookOpen, trend: "+2 this month", trendUp: true },
  { label: "Completed", value: "5", icon: Award, trend: "+1 this month", trendUp: true },
  { label: "Hours Learned", value: "128", icon: Clock, trend: "+12 this week", trendUp: true },
  { label: "Certificates", value: "3", icon: ScrollText, trend: "+1 this month", trendUp: true },
];

export const CONTINUE_COURSES: CourseCard[] = [
  { id: "c1", title: "Web Development Bootcamp", slug: "web-dev-bootcamp", instructor: "Dr. Sarah Chen", thumbnail: "/courses/web-dev.svg", progress: 65, category: "Web Development" },
  { id: "c2", title: "Data Science Fundamentals", slug: "data-science-fundamentals", instructor: "Prof. James Wilson", thumbnail: "/courses/data-science.svg", progress: 42, category: "Data Science" },
  { id: "c3", title: "UI/UX Design Masterclass", slug: "ui-ux-design-masterclass", instructor: "Lisa Chen", thumbnail: "/courses/design.svg", progress: 78, category: "Design" },
  { id: "c4", title: "Advanced React Patterns", slug: "advanced-react-patterns", instructor: "Dr. Sarah Chen", thumbnail: "/courses/react.svg", progress: 20, category: "Web Development" },
];

export const UPCOMING_DEADLINES: Deadline[] = [
  { id: "d1", title: "React Hooks Assignment", course: "Web Development Bootcamp", date: "2026-07-08", type: "assignment", urgent: true },
  { id: "d2", title: "Statistics Quiz", course: "Data Science Fundamentals", date: "2026-07-10", type: "quiz", urgent: false },
  { id: "d3", title: "Figma Prototype Project", course: "UI/UX Design Masterclass", date: "2026-07-14", type: "project", urgent: false },
];

export const LEARNING_STREAK = [true, true, true, true, false, true, true]; // last 7 days

// ── Instructor Dashboard ──

export const INSTRUCTOR_STATS: StatItem[] = [
  { label: "Total Students", value: "2,847", icon: Users, trend: "+124 this month", trendUp: true },
  { label: "Active Courses", value: "4", icon: BookOpen, trend: "Same", trendUp: true },
  { label: "Revenue", value: "$12,430", icon: DollarSign, trend: "+18%", trendUp: true },
  { label: "Avg Rating", value: "4.8", icon: Star, trend: "+0.1", trendUp: true },
];

export const COURSE_PERFORMANCE: CoursePerformance[] = [
  { id: "p1", title: "Web Development Bootcamp", students: 12400, trend: 12, trendUp: true },
  { id: "p2", title: "Advanced React Patterns", students: 5600, trend: 8, trendUp: true },
  { id: "p3", title: "Python for Everybody", students: 28000, trend: -3, trendUp: false },
];

export const RECENT_REVIEWS: Review[] = [
  { id: "r1", author: "Alex K.", avatar: "", rating: 5, excerpt: "Best course I've ever taken. The projects were incredibly practical.", course: "Web Development Bootcamp", date: "2 days ago" },
  { id: "r2", author: "Maria G.", avatar: "", rating: 5, excerpt: "Dr. Chen explains complex topics with remarkable clarity.", course: "Advanced React Patterns", date: "5 days ago" },
  { id: "r3", author: "James T.", avatar: "", rating: 4, excerpt: "Great content but could use more real-world examples.", course: "Python for Everybody", date: "1 week ago" },
];

export const PENDING_TASKS: PendingTask[] = [
  { id: "t1", title: "Review assignment submissions", count: 12 },
  { id: "t2", title: "Update Module 3 content", count: 1 },
  { id: "t3", title: "Respond to student questions", count: 5 },
  { id: "t4", title: "Grade final projects", count: 8 },
];

// ── Admin Dashboard ──

export const ADMIN_STATS: StatItem[] = [
  { label: "Total Users", value: "24,580", icon: Users, trend: "+892 this month", trendUp: true },
  { label: "Total Revenue", value: "$128,430", icon: DollarSign, trend: "+22%", trendUp: true },
  { label: "Platform Growth", value: "+18.5%", icon: TrendingUp, trend: "Monthly", trendUp: true },
  { label: "Active Courses", value: "142", icon: BookOpen, trend: "+12 this month", trendUp: true },
];

export const RECENT_ACTIVITY: Activity[] = [
  { id: "a1", text: "John D. enrolled in Web Development Bootcamp", timestamp: "2 min ago", type: "enrollment" },
  { id: "a2", text: "Prof. Wilson published new course: Machine Learning A-Z", timestamp: "1 hour ago", type: "course" },
  { id: "a3", text: "Sarah M. left a 5-star review on UI/UX Design", timestamp: "3 hours ago", type: "review" },
  { id: "a4", text: "Payment received — $49 from Alex K.", timestamp: "5 hours ago", type: "payment" },
  { id: "a5", text: "Lisa Chen enrolled in Advanced React Patterns", timestamp: "1 day ago", type: "enrollment" },
];

export const TOP_INSTRUCTORS: TopInstructor[] = [
  { id: "i1", name: "Dr. Sarah Chen", specialty: "Web Development", students: 18000, rating: 4.9, rank: 1 },
  { id: "i2", name: "Prof. James Wilson", specialty: "Data Science", students: 39000, rating: 4.8, rank: 2 },
  { id: "i3", name: "Lisa Chen", specialty: "Design", students: 23800, rating: 4.8, rank: 3 },
  { id: "i4", name: "Alex Rivera", specialty: "DevOps & Cloud", students: 7200, rating: 4.7, rank: 4 },
];

// ── Shared Data ──

export const ALL_COURSES = [
  { id: "1", title: "Web Development Bootcamp", instructor: "Dr. Sarah Chen", category: "Web Development", status: "Published" as const, students: 12400, price: 49, rating: 4.9 },
  { id: "2", title: "Data Science Fundamentals", instructor: "Prof. James Wilson", category: "Data Science", status: "Published" as const, students: 8900, price: 39, rating: 4.8 },
  { id: "3", title: "UI/UX Design Masterclass", instructor: "Lisa Chen", category: "Design", status: "Published" as const, students: 15600, price: 29, rating: 4.9 },
  { id: "4", title: "Advanced React Patterns", instructor: "Dr. Sarah Chen", category: "Web Development", status: "Draft" as const, students: 5600, price: 29, rating: 4.7 },
  { id: "5", title: "Machine Learning A-Z", instructor: "Prof. James Wilson", category: "Data Science", status: "Published" as const, students: 10200, price: 59, rating: 4.8 },
  { id: "6", title: "Figma for Developers", instructor: "Lisa Chen", category: "Design", status: "Draft" as const, students: 4300, price: 19, rating: 4.6 },
];

export const ALL_STUDENTS: Student[] = [
  { id: "s1", name: "Alex Johnson", email: "alex@example.com", avatar: "", enrolledDate: "2026-01-15", coursesCount: 4, status: "Active" },
  { id: "s2", name: "Maria Garcia", email: "maria@example.com", avatar: "", enrolledDate: "2026-02-20", coursesCount: 3, status: "Active" },
  { id: "s3", name: "James Thompson", email: "james@example.com", avatar: "", enrolledDate: "2026-03-10", coursesCount: 2, status: "Active" },
  { id: "s4", name: "Priya Sharma", email: "priya@example.com", avatar: "", enrolledDate: "2025-11-05", coursesCount: 6, status: "Active" },
  { id: "s5", name: "David Kim", email: "david@example.com", avatar: "", enrolledDate: "2026-04-01", coursesCount: 1, status: "Inactive" },
];

export const ALL_INSTRUCTORS: Instructor[] = [
  { id: "i1", name: "Dr. Sarah Chen", specialty: "Web Development", avatar: "", rating: 4.9, studentsCount: 18000, coursesCount: 4 },
  { id: "i2", name: "Prof. James Wilson", specialty: "Data Science", avatar: "", rating: 4.8, studentsCount: 39000, coursesCount: 6 },
  { id: "i3", name: "Lisa Chen", specialty: "Design", avatar: "", rating: 4.8, studentsCount: 23800, coursesCount: 5 },
  { id: "i4", name: "Alex Rivera", specialty: "DevOps & Cloud", avatar: "", rating: 4.7, studentsCount: 7200, coursesCount: 3 },
];

export const ALL_CERTIFICATES: Certificate[] = [
  { id: "cert1", courseName: "Web Development Bootcamp", completionDate: "2026-06-15", downloadUrl: "#" },
  { id: "cert2", courseName: "UI/UX Design Masterclass", completionDate: "2026-05-20", downloadUrl: "#" },
  { id: "cert3", courseName: "Python for Everybody", completionDate: "2026-04-10", downloadUrl: "#" },
];

// Calendar events
export const CALENDAR_EVENTS = [
  { date: "2026-07-08", title: "React Hooks Assignment Due", type: "assignment" as const },
  { date: "2026-07-10", title: "Statistics Quiz", type: "quiz" as const },
  { date: "2026-07-14", title: "Figma Prototype Due", type: "project" as const },
  { date: "2026-07-18", title: "Web Dev Midterm", type: "exam" as const },
];
