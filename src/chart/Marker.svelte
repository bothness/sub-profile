<script>
	import { getContext } from 'svelte';
	const { data, xGet, yGet, xScale, yScale, xDomain, yDomain } = getContext('LayerCake');
	export let axis = 'x';
	export let color = 'orange';
	
	$: min = axis == 'y' ? $xDomain[0] : $yDomain[0];
	$: max = axis == 'y' ? $xDomain[1] : $yDomain[1];
</script>

{#each $data as d}
<g class="marker">
	<line
		x1="{axis == 'y' ? $xScale(max) : $xGet(d)}"
		x2="{axis == 'y' ? $xScale(min) : $xGet(d)}"
		y1="{axis == 'y' ? $yGet(d) : $yScale(max)}"
		y2="{axis == 'y' ? $yGet(d) : $yScale(min)}"
		stroke="{color}"
		stroke-width="3"
		stroke-linecap="butt"
	/>
</g>
{/each}