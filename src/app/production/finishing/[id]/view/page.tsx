"use client";

import { JobCardDetail } from "@/components/production/job-card-detail";
import { useParams } from "next/navigation";

export default function FinishingJobCardView() {
  const params = useParams();
  const id = params.id as string;
  
  return <JobCardDetail id={id} department="Finishing" />;
}
