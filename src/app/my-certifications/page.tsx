"use server";

import { createClient } from "@/utils/supabase/server";
import { getMyCertifications } from "../courses/actions";
import { MyCertificationsClient } from "./client";

export default async function MyCertificationsPage() {
    const certifications = await getMyCertifications();

    return <MyCertificationsClient initialCertifications={certifications} />;
}
