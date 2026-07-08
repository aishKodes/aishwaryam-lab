import type { Metadata } from "next";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard";

export const metadata: Metadata = {
  title: "Teacher Results | Project Thales",
  description: "PIN-protected teacher results dashboard for Project Thales."
};

export default function TeacherPage() {
  return <TeacherDashboard />;
}
