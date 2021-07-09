<script>
	import { ckmeans } from "simple-statistics";
	import { getData, getGeo, getCSV, getColor, suffixer, changeClass, changeStr } from "./utils";
	import { urls, datasets, options, codes, mapStyle, msoaBldg, msoaBounds, colors } from "./config";
	import ColChart from "./chart/ColChart.svelte";
	import StackedBarChart from "./chart/StackedBarChart.svelte";
	import Warning from "./ui/Warning.svelte";
	import Map from "./map/Map.svelte";
	import MapSource from "./map/MapSource.svelte";
	import MapLayer from "./map/MapLayer.svelte";
	import SpineChart from "./chart/SpineChart.svelte";
	
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
		selected: null,
		geoLookup: null,
		geoCodes: null,
		geoAll: null,
		geoPerc: null,
		geoBreaks: null
	};
	let sum = {
		all: null,
		selected: null
	}

	function loadData() {
		getData(datasets, selected)
		.then(json => {
			data.selected = json.data;
			sum.selected = makeSum(json.data.residents.age.values);
			if (!data.all) {
				data.all = data.selected;
				sum.all = sum.selected;
			}
			
		});
		getGeo(selected)
		.then(json => {
			let categories = json.data.dataset.table.dimensions[0].categories;
			let codes = categories.map(d => d.code.slice(-9))
			
			let values = json.data.dataset.table.values;

			let index = {};
			codes.forEach((code, i) => {
				index[code] = values[i];
			});
			if (!data.geoAll) {
				data.geoAll = index;
				data.geoCodes = codes;
			};

			let array = [];
			data.geoCodes.forEach(code => {
				array.push({code: code, name: data.geoLookup[code], value: index[code] ? (index[code] / data.geoAll[code]) * 100 : null});
			});

			let groups = ckmeans(array.map(d => d.value).filter(d => d != null), 5);

			if (!groups[1]) {
				array.forEach(d => d.color = colors.seq[4]);
				data.geoBreaks = [0, 100];
			} else {
				let breaks = [];
				groups.forEach(grp => breaks.push(grp[0]));
				breaks.push(groups[groups.length - 1][groups[groups.length - 1].length - 1]);
				if (breaks[breaks.length - 1] == breaks[breaks.length - 2]) {
					breaks.pop();
				}
				array.forEach(d => d.color = d.value ? getColor(d.value, breaks, colors.seq) : colors.nodata);
				data.geoBreaks = breaks;
			}

			data.geoPerc = array;
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

	function getMedianAge(dataset) {
		let values = dataset.residents.age.values;
		let sum = makeSum(values);

		let i = 0;
		let count = 0;
		while (count < sum / 2) {
			count += values[i];
			i += 1;
		}
		return i - 1;
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
			width =  val + 60;
		}
		return width
	}

	getCSV(urls.names)
	.then(json => {
		let index = {};
		json.forEach(d => index[d.code] = d.name);
		data.geoLookup = index;
		return data.geoLookup;
	})
	.then(lookup => {
		loadData();
	});

	$: w && onResize();
</script>

<Warning/>

<div class="grid">
	<div>
		<span class="text-big">
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.sex} on:change={loadData} style="width: {wSex && getWidth(wSex)}px">
				{#each options.sex as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>
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
		<span class="text-label">Median Age</span>
		<br/>
		<span class="inline text-big">{getMedianAge(data.selected)}</span>
		<span class="inline text-small">years</span>
		{#if sum.all != sum.selected}
		<div class="text-small muted">vs {getMedianAge(data.all)} years for whole population</div>
		{/if}
	</div>
	<div id="map" style="grid-column: span {cols >= 2 ? 2 : 1};">
		<span class="text-label">% of population by neighbourhood</span><br/>
		<div class="chart" style="height: 40px;">
			{#if data.geoBreaks && data.geoPerc}
			<SpineChart ticks={data.geoBreaks} data={hovered && data.geoPerc.find(d => d.code == hovered) ? [{x: data.geoPerc.find(d => d.code == hovered).value}] : []} colors={data.geoBreaks[1] == 100 ? [colors.seq[4]] : colors.seq}/>
			{/if}
		</div>
		<Map bind:map style={mapStyle} location={{ lon: -1.8904, lat: 52.4862, zoom: 10 }}>
			{#if data.geoPerc}
			<MapSource
				id="msoa-buildings"
				type="vector"
				url={msoaBldg.url}
				layer={msoaBldg.layer}
				promoteId={msoaBldg.code}
				maxzoom={13}
			>
				<MapLayer
					id="msoa-buildings"
					data={data.geoPerc}
					geoCode="code"
					colorCode="color"
					type="fill"
					paint={{
						"fill-color": [
							"case",
							["!=", ["feature-state", "color"], null],
							["feature-state", "color"],
							"rgba(255, 255, 255, 0)",
						],
					}}
					order="aeroway-taxiway"
				/>
			</MapSource>
			<MapSource
				id="msoa-bounds"
				type="vector"
				url={msoaBounds.url}
				layer={msoaBounds.layer}
				promoteId={msoaBounds.code}
				maxzoom={13}
			>
				<MapLayer
					id="msoa-fill"
					data={data.geoPerc}
					geoCode="code"
					nameCode="name"
					valueCode="value"
					hover={true}
					bind:hovered={hovered}
					tooltip={true}
					type="fill"
					paint={{
						"fill-color": "rgba(255, 255, 255, 0)",
					}}
					order="highway_name_other"
				/>
				<MapLayer
					id="msoa-line"
					type="line"
					paint={{
						"line-color": "orange",
						"line-width": 2,
						"line-opacity": [
							"case",
							["==", ["feature-state", "hovered"], true],
							1,
							0,
						],
					}}
					order="highway_name_other"
				/>
			</MapSource>
			{/if}
		</Map>
	</div>
	<div>
		<span class="text-label">Age profile</span><br/>
		<div class="chart" style="height: 100px;">
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
		<div class="chart" style="height: 100px;">
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
</div>

<div class="text-big hidden" aria-hidden="true" bind:clientWidth={wSex}>{selected.sex ? selected.sex.label : ''}</div>
<div class="text-big hidden" aria-hidden="true" bind:clientWidth={wEthnicity}>{selected.ethnicity ? selected.ethnicity.label : ''}</div>
<div class="text-big hidden" aria-hidden="true" bind:clientWidth={wBorn}>{selected.born ? selected.born.label : ''}</div>

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
		grid-auto-flow: row dense;
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
		height: 0;
		line-height: 0;
	}
	#map {
		grid-row: span 3;
		min-height: 450px;
	}
	</style>