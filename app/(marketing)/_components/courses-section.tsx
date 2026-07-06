import { COURSES } from "@/constants/landing";
import { CourseCard } from "@/components/courses/course-card";

export default function CoursesSection() {
  return (
    <div className="py-12">
      <h2 className="mb-6 text-lg font-semibold text-white">Courses</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.slice(0, 6).map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
