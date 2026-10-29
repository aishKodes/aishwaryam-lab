import { redirect } from "next/navigation";
import { GAUSS_PATH } from "@/data/gauss-lesson";

export default function GaussAlias() {
  redirect(GAUSS_PATH);
}
