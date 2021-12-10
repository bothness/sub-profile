<script>
  import { setContext } from "svelte";
	import { ckmeans } from "simple-statistics";
	import { getData, getGeo, getCSV, getTopo, getColor, suffixer, changeClass, changeStr } from "./utils";
	import { themes, urls, datasets, vars, codes, mapStyle, ladBounds, colors, texts, arrow, spacer } from "./config";
	import Warning from "./ui/Warning.svelte";
	import ONSHeader from "./layout/ONSHeader.svelte";
	import ONSFooter from "./layout/ONSFooter.svelte";
  import Section from "./layout/Section.svelte";
	import ColChart from "./chart/ColChart.svelte";
	import StackedBarChart from "./chart/StackedBarChart.svelte";
	import Map from "./map/Map.svelte";
	import MapSource from "./map/MapSource.svelte";
	import MapLayer from "./map/MapLayer.svelte";
	import SpineChart from "./chart/SpineChart.svelte";

	// STYLE CONFIG
  // Set theme globally (options are 'light' or 'dark')
  let theme = "light";
  setContext("theme", themes[theme]);
	
	// Elements
	let w, cols;
	let map = null;

	// State
	let active = null;
	let active_cats = {};
	let selected = [];
	vars.forEach(d => {
		active_cats[d.label] = d.cats[0];
	});
	let hovered = null;
	let status = 'loading'; // Options: success, fail, loading
	let u16 = false; // If age selection is 0-15 some tables won't show data
	let varcount = 0; // Number of variables successfully loaded

	$: ops = vars.filter(d => !selected.map(d => d.topic).includes(d.label));

	// Data
	let data = {
		all: null,
		selected: null,
		geojson: null,
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

	function capitalise(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	
	function doSelect(topic) {
		selected = [...selected, {topic: active.label, ...active_cats[topic]}];
		active = null;
		loadData();
	}
	
	function unSelect(topic) {
		selected = selected.filter(d => d.topic != topic);
		loadData();
	}

	function loadData() {
		status = 'loading';

		if (selected && selected.map(d => d.code).includes('0-15')) {
			u16 = true;
		} else {
			u16 = false;
		}

		getData(datasets, selected)
		.then(json => {
			if (json.data.residents.age.values) {
				sum.selected = makeSum(json.data.residents.health.values);
				data.selected = json.data;
				if (!data.all) {
					data.all = data.selected;
					sum.all = sum.selected;
				}

				getGeo(selected)
				.then(json => {
					let array = [];
					let groups = null;

					if (json.data.dataset.table.dimensions) {
						let categories = json.data.dataset.table.dimensions[0].categories;
						let codes = categories.map(d => d.code.slice(-9));
					
						let values = json.data.dataset.table.values;

						let index = {};
						codes.forEach((code, i) => {
							index[code] = values[i];
						});
						if (!data.geoAll) {
							data.geoAll = index;
							data.geoCodes = codes;
						};

						data.geoCodes.forEach(code => {
							array.push({code: code, name: data.geoLookup[code], value: index[code] ? (index[code] / data.geoAll[code]) * 100 : null});
						});

						let vals = array.map(d => d.value).filter(d => d != null);
						groups = vals[4] ? ckmeans(vals, 5) : null;
					} else {
						data.geoCodes.forEach(code => {
							array.push({code: code, name: data.geoLookup[code], value: null});
						});
					}

					if (groups == null) {
						array.forEach(d => d.color = colors.nodata);
						data.geoBreaks = [0, 100];
					} else if (!groups[1]) {
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
					varcount = selected.length;
					status = 'success';
				});
			} else {
				status = 'failed';
			}
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
		return values ? values.reduce((a, b) => a + b) : 0;
	}

	function isNA(arr) {
		let sum = arr ? arr.slice(0,-1).reduce((a, b) => a + b) : 0;
		return sum == 0;
	}

	function onResize() {
		cols = w < 575 ? 1 : window.getComputedStyle(grid).getPropertyValue("grid-template-columns").split(" ").length;
	}

	getTopo(ladBounds.url, ladBounds.layer)
	.then(json => {
		console.log(json);
		let index = {};
		json.features.forEach(d => index[d.properties[ladBounds.code]] = d.properties[ladBounds.name]);
		data.geojson = json;
		data.geoLookup = index;
		return data.geoLookup;
	})
	.then(() => {
		loadData();
	});

	$: w && onResize();
</script>

<Warning/>
<ONSHeader/>

<Section column="wide">

<h1 class="mtl">Key population explorer</h1>

<p>Select one or more topics to define a population group to compare with the whole population of England and Wales.</p>

<select bind:value={active} disabled={!ops[0]}>
	<option value={null}>{!ops[0] ? 'No more topics available' : selected[0] ? 'Select another topic' : 'Select a topic'}</option>
	{#each ops as op, i}
	<option value={op}>{capitalise(op.label)}</option>
	{/each}
</select>

{#if active}
<select bind:value={active_cats[active.label]}>
	{#each active.cats as cat}
	<option value={cat}>{@html cat.indent ? Array.from({length: cat.indent - 1}, v => spacer).join('') + arrow : ''}{capitalise(cat.label)}</option>
	{/each}
</select>
<button class="btn" on:mouseup={() => doSelect(active.label)}>
	Add
</button>
{/if}

{#if selected[0]}
<br/>
{#each selected as item, i}
{#if status == 'loading' && i == selected.length - 1}
<div class="chip chip-pending">
	<span>{capitalise(item.topic)}: {capitalise(item.label)}</span>
	<div class="loader"/>
</div>
{:else}
<div class="chip" class:chip-inactive={i >= varcount}>
	<span>{capitalise(item.topic)}: {capitalise(item.label)}</span>
	<button class="btn-pill" on:click="{() => unSelect(item.topic)}"/>
</div>
{/if}
{/each}
{/if}

{#if status == "failed" || u16 == true}
<div class="warning">
	Some datasets not available for selected variables.
	{#if status == "failed"}
	Try removing a variable to see more datasets.
	{/if}
	{#if u16 == true}
	Economic indicators (employment, social status etc) not available for ages 0 to 15.
	{/if}
</div>
{/if}

{#if data.all && data.selected && sum.all && sum.selected >= 0}
<div id="grid" class="grid mt" bind:clientWidth={w}>
	<div>
		<span class="text-label">Population</span><br/>
		{#if sum.selected == 0}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<span class="inline text-big">{Math.round((sum.selected / sum.all) * 100) > 0 ? Math.round((sum.selected / sum.all) * 100) : '<1'}%</span>
		<span class="inline condensed text-small">of people in<br/>England and Wales</span>
		<div class="text-small muted">{sum.selected.toLocaleString()} of {sum.all.toLocaleString()} people</div>
		{/if}
	</div>
	<div>
		<span class="text-label">Median Age</span><br/>
		{#if isNA(data.selected.residents.age.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<span class="inline text-big">{getMedianAge(data.selected)}</span>
		<span class="inline text-small">years</span>
		{#if sum.all != sum.selected}
		<div class="text-small muted">vs {getMedianAge(data.all)} years for whole population</div>
		{/if}
		{/if}
	</div>
	<div id="map" style="grid-column: span {cols >= 2 ? 2 : 1};">
		<span class="text-label">% of population by neighbourhood</span><br/>
		<div class="chart" style="height: 40px;">
			{#if data.geoBreaks && data.geoPerc}
			<SpineChart ticks={data.geoBreaks} data={hovered && data.geoPerc.find(d => d.code == hovered) ? [{x: data.geoPerc.find(d => d.code == hovered).value}] : []} colors={data.geoBreaks[1] == 100 ? [colors.seq[4]] : colors.seq}/>
			{/if}
		</div>
		<Map bind:map style={mapStyle}>
			{#if data.geojson && data.geoPerc}
			<MapSource
				id="lad"
				type="geojson"
				data={data.geojson}
				promoteId={ladBounds.code}
			>
				<MapLayer
					id="lad-fill"
					data={data.geoPerc}
					geoCode="code"
					nameCode="name"
					colorCode="color"
					valueCode="value"
					hover={true}
					bind:hovered={hovered}
					tooltip={true}
					type="fill"
					paint={{
						"fill-color": [
							"case",
							["!=", ["feature-state", "color"], null],
							["feature-state", "color"],
							"rgba(255, 255, 255, 0)",
						],
						"fill-opacity": 0.8
					}}
					order="highway_name_other"
				/>
				<MapLayer
					id="lad-line"
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
		{#if isNA(data.selected.residents.age.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<div class="chart" style="height: 100px;">
			<ColChart data="{data.selected && makeData(['residents','age'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		</div>
		{#if sum.all != sum.selected}
		<div class="text-small muted"><li class="line"></li> {texts.comparison}</div>
		{/if}
		{/if}
	</div>
	<div>
		<span class="text-label">General health</span><br/>
		{#if isNA(data.selected.residents.health.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<StackedBarChart label={texts.comparison} data="{data.selected && makeData(['residents', 'health'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		{/if}
	</div>
	<div>
		<span class="text-label">Social grade</span><br/>
		{#if isNA(data.selected.residents.grade.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<StackedBarChart label={texts.comparison} data="{data.selected && makeData(['residents', 'grade'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		{/if}
	</div>
	<div>
		<span class="text-label">Economic activity</span><br/>
		{#if isNA(data.selected.residents.economic.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<StackedBarChart label={texts.comparison} data="{data.selected && makeData(['residents', 'economic'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		{/if}
	</div>
	<div>
		<span class="text-label">Distance to work (km)</span><br/>
		{#if isNA(data.selected.residents.distance.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<div class="chart" style="height: 100px;">
			<ColChart data="{data.selected && makeData(['residents','distance'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		</div>
		{#if sum.all != sum.selected}
		<div class="text-small muted"><li class="line"></li> vs whole population</div>
		{/if}
		<div class="text-small muted">Excludes home workers and other circumstances</div>
		{/if}
	</div>
	<div>
		<span class="text-label">Mode of travel to work</span><br/>
		{#if isNA(data.selected.residents.travel.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<StackedBarChart label={texts.comparison} data="{data.selected && makeData(['residents', 'travel'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		{/if}
	</div>
	<div>
		<span class="text-label">Type of housing</span><br/>
		{#if isNA(data.selected.households.housing.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<StackedBarChart label={texts.comparison} data="{data.selected && makeData(['households', 'housing'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		{/if}
	</div>
	<div>
		<span class="text-label">Tenure of housing</span><br/>
		{#if isNA(data.selected.households.tenure.values)}
		<span class="muted">{texts.nodata}</span>
		{:else}
		<StackedBarChart label={texts.comparison} data="{data.selected && makeData(['households', 'tenure'])}" zKey="{sum.all != sum.selected ? 'z' : null}"/>
		{/if}
	</div>
</div>
{/if}

</Section>

<ONSFooter/>

<style>
	a {
		color: rgb(0, 60, 87);
	}
	img {
		width: 200px;
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
	.text-med {
		font-size: 1.8em;
		font-weight: bold;
		line-height: 1.7;
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
	.mtl {
		margin-top: 50px;
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
	#map {
		grid-row: span 3;
		min-height: 450px;
	}

	h1 {
		font-weight: bold;
	}
	select {
		appearance: none;
		background: white url("https://ons-design-system.netlify.app/img/icons--chevron-down.svg") padding-box no-repeat;
		background-position: calc(100% - 10px) 50%;
		background-size: 18px;
		border: 1.5px solid rgb(34, 34, 34);
		outline: 1.5px solid white;
		border-radius: 3px;
		padding: 7px 36px 7px 9px;
		margin-top: 12px;
	}
	select:focus {
		outline-color: rgb(34, 34, 34);
		box-shadow: 0 0 0 4px orange;
	}
	button {
		cursor: pointer;
	}
	.btn {
		color: white;
		background: #0f8243;
		font-weight: bold;
		border: 0;
		border-radius: 3px;
		box-shadow: 0 3px #193c23;
		padding: 7px 20px;
		transform: translate(0, -1.5px);
	}
	.btn:hover {
		background-color: #30693c;
	}
	.btn:active {
		box-shadow: none;
		transform: translate(0, 1.5px);
	}
	.warning {
		background-color: rgb(250, 230, 232);
		border: none;
		border-left: 5px solid #d0021b;
		padding: 10px;
		font-size: 0.9rem;
	}
	.chip {
		display: inline-flex;
		vertical-align: middle;
		background-color: rgb(231, 243, 236);
		font-size: 0.9rem;
		border: 1.5px solid #0f8243;
		border-radius: 20px;
		padding: 5px;
		margin: 0 5px 5px 0;
	}
	.chip-inactive {
		background-color: rgb(250, 230, 232);
		border-color: #d0021b;
	}
	.chip-pending {
		background-color: #fef4ee;
		border-color: #ff803b;
	}
	.chip span {
		padding: 0 10px;
	}
	.chip button {
		background: #0f8243 url("https://bothness.github.io/geo-draw/img/x-close.svg") no-repeat center;
		margin: 0;
		width: 20px;
		height: 20px;
		border: none;
		border-radius: 50%;
	}
	.chip-inactive button {
		background-color: #d0021b;
	}
	.loader {
		box-sizing: border-box;
		border: 5px solid rgba(0,0,0,0.2);
		border-radius: 50%;
		border-top: 5px solid #ff803b;
		border-right: 5px solid #ff803b;
		width: 20px;
		height: 20px;
		-webkit-animation: spin 2s linear infinite; /* Safari */
		animation: spin .75s linear infinite;
	}
	/* Safari */
	@-webkit-keyframes spin {
		0% { -webkit-transform: rotate(0deg); }
		100% { -webkit-transform: rotate(360deg); }
	}
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>