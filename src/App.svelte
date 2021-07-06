<script>
	import { getData, getGeo, suffixer, changeClass, changeStr } from "./utils";
	import { urls, datasets, options, codes, mapStyle } from "./config";
	import ColChart from "./chart/ColChart.svelte";
	import StackedBarChart from "./chart/StackedBarChart.svelte";
	import Warning from "./ui/Warning.svelte";
	import Map from "./map/Map.svelte";
	import MapSource from "./map/MapSource.svelte";
	import MapLayer from "./map/MapLayer.svelte";
	
	// Elements
	let w, wSex, wEthnicity, wBorn, cols;
	let map = null;

	// State
	let selected = {
		sex: options.sex[0],
		ethnicity: options.ethnicity[0],
		born: options.born[0]
	};
	let hovered = null;

	// Data
	let data = {
		all: null,
		selected: null
	};
	let sum = {
		all: null,
		selected: null
	}
	
	function loadSelection() {
		fetch(urls.places + code + '.json')
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			
			if (json.count > 20) {
				fetch(urls.quantiles + json.type + '.json')
				.then(res => res.json())
				.then(quart => {
					quartiles = quart;
					place = json;
					updateActive(place);
					fitMap(place.bounds);
				});
			} else {
				quartiles = null;
				place = json;
				updateActive(place);
				fitMap(place.bounds);
			}
		});
	}

	function loadAll() {
		getData(datasets)
		.then(json => {
			data.all = json.data;
			sum.all = makeSum(json.data.residents.age.values);
			data.selected = data.all;
			sum.selected = sum.all;
		});
	}

	function loadData() {
		getData(datasets, selected)
		.then(json => {
			data.selected = json.data;
			sum.selected = makeSum(json.data.residents.age.values);
		});
	}
	
	function makeData(props) {
		let group = props[0];
		let dataset = props[1];
		let valsAll = data.all[group][dataset].values;
		let valsSelected = data.selected[group][dataset].values;

		let arr = [];
		let sumAll = 0;
		let sumSelected = 0;

		codes[dataset].forEach(cd => {
			let label = cd.label;
			let valAll = 0;
			let valSelected = 0;
			cd.cells.forEach(i => {
				valAll += valsAll[i];
				sumAll += valsAll[i];
				valSelected += valsSelected[i];
				sumSelected += valsSelected[i];
			});
			arr.push({x: label, yVal: valSelected, zVal: valAll});
		});

		arr.forEach(d => {
			d.y = (d.yVal / sumSelected) * 100;
			d.z = (d.zVal / sumAll) * 100;
		});

		return arr;
	}

	function makeSum(values) {
		return values.reduce((acc, curr) => acc + curr);
	}

	function onResize() {
		cols = w < 575 ? 1 : window.getComputedStyle(grid).getPropertyValue("grid-template-columns").split(" ").length;
	}

	function getWidth(val) {
		let width = 300;
		if (val) {
			width =  val + 50;
		}
		return width
	}

	loadAll();

	$: w && onResize();
</script>

<Warning/>

<div class="text-big hidden" aria-hidden="true" bind:clientWidth={wSex}>{selected.sex ? selected.sex.label : ''}</div>
<div class="text-big hidden" aria-hidden="true" bind:clientWidth={wEthnicity}>{selected.ethnicity ? selected.ethnicity.label : ''}</div>
<div class="text-big hidden" aria-hidden="true" bind:clientWidth={wBorn}>{selected.born ? selected.born.label : ''}</div>

<div class="grid">
	<div>
		<span class="text-big">
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.sex} on:change={loadData} style="width: {wSex && getWidth(wSex)}px">
				{#each options.sex as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>, 
			of
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.ethnicity} on:change={loadData} style="width: {wEthnicity ? wEthnicity + 50 : 300}px">
				{#each options.ethnicity as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>
			ethnicity, 
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.born} on:change={loadData} style="width: {wBorn ? wBorn + 50 : 300}px">
				{#each options.born as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>
		</span>
		{#if sum.all != sum.selected}
		<br/>Compared with overall population of England and Wales
		{/if}
	</div>
</div>

{#if data.all && data.selected && sum.all && sum.selected}
<div id="grid" class="grid mt" bind:clientWidth={w}>
	<div>
		<span class="text-label">Population</span>
		<br/>
		<span class="inline text-big">{Math.round((sum.selected / sum.all) * 100) > 0 ? Math.round((sum.selected / sum.all) * 100) : '<1'}%</span>
		<span class="inline condensed text-small">of people in<br/>England and Wales</span>
		<div class="text-small muted">{sum.selected.toLocaleString()} of {sum.all.toLocaleString()} people</div>
	</div>
	<div>
		<span class="text-label">Age profile</span><br/>
		<div class="chart" style="height: 85px;">
			<ColChart data="{data.selected && makeData(['residents','age'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		</div>
		{#if sum.all != sum.selected}
		<div class="text-small muted"><li class="line"></li> vs England and Wales</div>
		{/if}
	</div>
	<div>
		<span class="text-label">General health</span><br/>
		<StackedBarChart data="{data.selected && makeData(['residents', 'health'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
	</div>
	<div>
		<span class="text-label">Social grade</span><br/>
		<StackedBarChart data="{data.selected && makeData(['residents', 'grade'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
	</div>
	<div>
		<span class="text-label">Economic activity</span><br/>
		<StackedBarChart data="{data.selected && makeData(['residents', 'economic'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
	</div>
	<div>
		<span class="text-label">Distance to work (km)</span><br/>
		<div class="chart" style="height: 85px;">
			<ColChart data="{data.selected && makeData(['residents','distance'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		</div>
		{#if sum.all != sum.selected}
		<div class="text-small muted"><li class="line"></li> vs England and Wales</div>
		{/if}
		<div class="text-small muted">Excludes home workers and other circumstances</div>
	</div>
	<div>
		<span class="text-label">Mode of travel to work</span><br/>
		<StackedBarChart data="{data.selected && makeData(['residents', 'travel'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
	</div>
	<div>
		<span class="text-label">Type of housing</span><br/>
		<StackedBarChart data="{data.selected && makeData(['households', 'housing'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
	</div>
	<div>
		<span class="text-label">Tenure of housing</span><br/>
		<StackedBarChart data="{data.selected && makeData(['households', 'tenure'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
	</div>
	{#if false}
	<div id="map" style="grid-column: span {cols == 2 ? 2 : cols && cols > 2 ? cols - 1 : 1};">
		<Map bind:map location={{bounds: place.bounds}} style={mapStyle}>
			<MapSource {...mapSources.wd}>
				<MapLayer
					{...mapLayers.wd}
					id="wd-fill"
					type="fill"
					click={true}
					selected={active.selected}
					on:select={mapSelect}
					highlight={true}
					highlighted={active.highlighted}
					hover={true}
					hovered={active.hovered}
					layout={{visibility: active.type == 'wd' || active.childType == 'wd' ? 'visible' : 'none'}}
					paint={active.type == 'wd' ? mapPaint['fill-self'] : active.childType == 'wd' ? mapPaint['fill-child'] : mapPaint.fill}/>
				<MapLayer
					{...mapLayers.wd}
					id="wd-bounds"
					type="line"
					selected={active.selected}
					highlight={true}
					highlighted={active.highlighted}
					layout={{visibility: active.type == 'wd' || active.childType == 'wd' ? 'visible' : 'none'}}
					paint={active.type == 'wd' ? mapPaint['line-active'] : active.childType == 'wd' ? mapPaint['line-child'] : mapPaint.line}/>
				<MapLayer
					{...mapLayers.wd}
					id="wd-self"
					type="line"
					selected={active.selected}
					layout={{visibility: active.type == 'wd' ? 'visible' : 'none'}}
					paint={active.type == 'wd' ? mapPaint['line-self'] : mapPaint.line}/>
			</MapSource>
			<MapSource {...mapSources.crd}>
				{#each Object.keys(mapLayers).filter(d => d != 'wd') as key}
				<MapLayer
					{...mapLayers[key]}
					id={key + "-fill"}
					type="fill"
					click={true}
					selected={active.selected}
					on:select={mapSelect}
					highlight={true}
					highlighted={active.highlighted}
					hover={true}
					hovered={active.hovered}
					layout={{visibility: active.type == key || active.childType == key ? 'visible' : 'none'}}
					paint={active.type == key ? mapPaint['fill-active'] : active.childType == key ? mapPaint['fill-child'] : mapPaint.fill}/>
				<MapLayer
					{...mapLayers[key]}
					id={key + "-bounds"}
					type="line"
					selected={active.selected}
					highlight={true}
					highlighted={active.highlighted}
					layout={{visibility: active.type == key || active.childType == key ? 'visible' : 'none'}}
					paint={active.type == key ? mapPaint['line-active'] : active.childType == key ? mapPaint['line-child'] : mapPaint.line}/>
				<MapLayer
					{...mapLayers[key]}
					id={key + "-self"}
					type="line"
					selected={active.selected}
					layout={{visibility: active.type == key ? 'visible' : 'none'}}
					paint={active.type == key ? mapPaint['line-self'] : mapPaint.line}/>
				{/each}
			</MapSource>
		</Map>
	</div>
	{/if}
</div>

<div class="grid mt mbs">
	<div>
		<img src="https://onsvisual.github.io/svelte-scrolly/img/ons-logo-pos-en.svg" alt="Office for National Statistics"/>
	</div>
	<div class:text-right={cols > 1}>
		<span class="text-small">Source: Census 2011, with change +/- from Census 2001.</span>
	</div>
</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
	:global(body) {
		font-family: 'Open Sans', sans-serif;
	}
	a {
		color: rgb(0, 60, 87);
	}
	img {
		width: 200px;
	}
	select {
		margin: 0;
		font-weight: bold;
	}
	.btn {
		padding: 2px 4px;
		margin: 0;
		border: 2px solid #206095;
		cursor: pointer;
		color: #206095;
		background-color: lightgrey;
	}
	.btn-active {
		color: white;
		background-color: #206095;
	}
	.text-big {
		font-size: 2.2em;
		font-weight: bold;
	}
	.text-small {
		font-size: 0.85em;
	}
	.text-label {
		font-weight: bold;
	}
	.muted {
		color: grey;
	}
	.capitalise {
		text-transform: capitalize;
	}
	.increase {
		color: green;
	}
	.increase::before {
		content: '▲';
		color: green;
	}
	.decrease {
		color: red;
	}
	.decrease::before {
		content: '▼';
		color: red;
	}
	.nochange {
		font-size: 0.85em;
		color: grey;
	}
	.line {
		background-color: #27A0CC;
		width: 25px;
  	height: 2px;
  	display: inline-block;
		margin-bottom: 3px;
	}
	.text-right {
		text-align: right;
	}
	.float-right {
		float: right;
	}
	.inline {
		display: inline-block;
	}
	.condensed {
		line-height: 1.1em;
	}
	.mt {
		margin-top: 20px;
	}
	.mts {
		margin-top: 10px;
	}
	.mbs {
		margin-bottom: 10px;
	}
	.grid {
		display: grid;
		width: 100%;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		justify-content: stretch;
	}
	#grid {
		grid-gap: 20px !important;
	}
	.chart {
		position: relative;
		width: 100%;
	}
	.hidden {
		position: absolute;
		display: inline-block;
		top: -1000px;
	}
	#map {
		grid-row: span 2;
		min-height: 450px;
	}
	</style>