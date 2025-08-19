import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
	getInterviewByUserId,
	getLatestInterviews,
} from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async () => {
	const user = await getCurrentUser();

	const [userinterviews, latestInterviews] = await Promise.all([
		await getInterviewByUserId(user?.id!),
		await getLatestInterviews({ userId: user?.id! }),
	]);

	const hasPastInterviews = userinterviews?.length > 0;
	const hasUpcomingInterviews = latestInterviews?.length > 0;

	return (
		<>
			<section className="card-cta">
				<div className="flex flex-col gap-6 max-w-lg">
					<h2>Get Interview Ready with AI-Powered Practice & Feedback</h2>
					<p className="text-lg">
						Practice on real interview questions and get instant feedback with
						our AI-powered platform.
					</p>

					<Button asChild className="btn-primary max-sm:w-full">
						<Link href="/interview">Start Practicing</Link>
					</Button>
				</div>

				<Image
					src="/robot.png"
					alt="robot-dude"
					width={400}
					height={400}
					className="max-sm:hidden"
				/>
			</section>

			<section className="flex flex-col gap-6 mt-8">
				<h2>Your Interviews</h2>

				<div className="interviews-section">
					{hasPastInterviews ? (
						userinterviews?.map((interview: any) => (
							<InterviewCard {...interview} key={interview.id} />
						))
					) : (
						<p>You have no past interviews.</p>
					)}
				</div>
			</section>

			<section className="flex flex-col gap-6 mt-8">
				<h2>Take An Interview</h2>
				<div className="interviews-section">
					{hasUpcomingInterviews ? (
						latestInterviews?.map((interview: any) => (
							<InterviewCard {...interview} key={interview.id} />
						))
					) : (
						<p>You have no upcoming interviews.</p>
					)}
				</div>
			</section>
		</>
	);
};

export default Page;
