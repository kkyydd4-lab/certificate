"use server";

import { getDashboardStats } from "./actions";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
    const dashboardData = await getDashboardStats();

    return <DashboardClient data={dashboardData} />;
}
