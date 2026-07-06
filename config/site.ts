import { BRAND } from "@/constants/brand";

export const siteConfig = {
  name: BRAND.name,
  description: BRAND.description,
  url: BRAND.url,
  navLinks: [
    { label: "Courses", href: "/courses" },
    { label: "Students", href: "/my-learning" },
    { label: "Instructors", href: "/instructor" },
  ],
}
