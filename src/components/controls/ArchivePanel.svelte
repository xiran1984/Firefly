<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import { getPostUrlBySlug } from "@/utils/url-utils";

export let sortedPosts: Post[] = [];

interface Post {
	id: string;
	data: {
		title: string;
		published: Date;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups: Group[] = [];
let collapsedYears: Set<number> = new Set();

function toggleYear(year: number) {
	const willCollapse = !collapsedYears.has(year);
	if (willCollapse) {
		collapsedYears.add(year);
	} else {
		collapsedYears.delete(year);
	}
	collapsedYears = new Set(collapsedYears);

	// 用 Web Animations API 做旋转动画，绕开 Swup 对 CSS transition 的干扰
	requestAnimationFrame(() => {
		const arrow = document.querySelector(
			`[data-year="${year}"] .archive-arrow`,
		);
		if (arrow) {
			arrow.animate(
				[
					{ transform: willCollapse ? "rotate(0deg)" : "rotate(-90deg)" },
					{ transform: willCollapse ? "rotate(-90deg)" : "rotate(0deg)" },
				],
				{ duration: 200, easing: "ease", fill: "forwards" },
			);
		}
	});
}

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

onMount(() => {
	// 按发布时间倒序排序，确保不受置顶影响
	const archivePosts = sortedPosts
		.slice()
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

	const grouped = archivePosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;

	// 默认只展开最近一年，其他年份折叠
	if (groupedPostsArray.length > 1) {
		collapsedYears = new Set(groupedPostsArray.slice(1).map((g) => g.year));
	}
});
</script>

<div class="card-base px-8 py-6">
	{#each groups as group}
		<div data-year={group.year}>
			<button
				class="flex flex-row w-full items-center h-15 cursor-pointer rounded-lg
				       hover:bg-(--btn-plain-bg-hover) transition-colors group/yr"
				on:click={() => toggleYear(group.year)}
				aria-expanded={!collapsedYears.has(group.year)}
			>
				<div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75
				            group-hover/yr:text-(--primary)">
					{group.year}
				</div>
				<div class="w-[15%] md:w-[10%]">
					<div
							class="h-3 w-3 bg-none rounded-full outline outline-(--primary) mx-auto
                  -outline-offset-2 z-50 outline-3"
					></div>
				</div>
				<div class="w-[70%] md:w-[80%] transition text-left text-50 flex items-center gap-2
				            group-hover/yr:text-(--primary)">
					{group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
					<span class="archive-arrow" style={collapsedYears.has(group.year) ? 'transform: rotate(-90deg)' : ''}>
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</span>
				</div>
			</button>

			{#if !collapsedYears.has(group.year)}
			{#each group.posts as post}
				<a
						href={getPostUrlBySlug(post.id)}
						aria-label={post.data.title}
						class="group btn-plain block! h-10 w-full rounded-lg hover:text-[initial]"
				>
					<div class="flex flex-row justify-start items-center h-full">
						<!-- date -->
						<div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
							{formatDate(post.data.published)}
						</div>

						<!-- dot and line -->
						<div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
							<div
									class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-(--primary)
                       outline outline-4 z-50
                       outline-(--card-bg)
                       group-hover:outline-(--btn-plain-bg-hover)
                       group-active:outline-(--btn-plain-bg-active)"
							></div>
						</div>

						<!-- post title -->
						<div
								class="w-[70%] md:w-[80%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-(--primary)
                     text-75 pr-8 whitespace-nowrap text-ellipsis overflow-hidden flex items-center gap-2"
						>
							<span class="truncate">{post.data.title}</span>
						</div>
					</div>
				</a>
			{/each}
			{/if}
		</div>
	{/each}
</div>

<style>
	.archive-arrow {
		display: inline-flex;
	}
</style>
