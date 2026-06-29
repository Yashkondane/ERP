"use client";

import { JobCardDetail } from "@/components/production/job-card-detail";
import { useParams } from "next/navigation";

export default function WashingJobCardView() {
  const params = useParams();
  const id = params.id as string;
  
  return <JobCardDetail id={id} department="Washing" />;
}
