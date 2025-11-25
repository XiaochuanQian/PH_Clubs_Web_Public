export const timelineData = [
	{
		id: 1,
		title: "v0.1.0",
		date: "2024-09-20",
		description: "• Add basic UI\n• Add home page, documentation page, and about page",
	},
	{
		id: 2,
		title: "v0.1.1",
		date: "2024-10-20",
		description: "• Improvement on UI, fix bugs",
	},
	{
		id: 3,
		title: "v0.1.2",
		date: "2024-11-10",
		description: "• Add stories page\n• Add database connection",
	},
];

export type TimelineData = (typeof timelineData)[number];

export interface TimelineElement {
	id: number;
	title: string;
	date: string;
	description: string;
}