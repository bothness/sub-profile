<script>
  import { setContext } from "svelte";
	import { ckmeans } from "simple-statistics";
	import { getData, getGeo, getCSV, getColor, suffixer, changeClass, changeStr } from "./utils";
	import { themes, urls, datasets, options, codes, mapStyle, msoaBldg, msoaBounds, colors, texts } from "./config";
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
	let w, wSex, wAge, wEthnicity, wReligion, wBorn, wEnglish, cols;
	let map = null;

	// State
	let selected = {
		sex: options.sex[0],
		age: options.age[0],
		ethnicity: options.ethnicity[0],
		religion: options.religion[0],
		born: options.born[0],
		english: options.english[0]
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
			sum.selected = makeSum(json.data.residents.health.values);
			data.selected = json.data;
			if (!data.all) {
				data.all = data.selected;
				sum.all = sum.selected;
			}
		});
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

	function getWidth(val) {
		let width = 200;
		if (val) {
			width =  val + 40;
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
	$: console.log(sum.selected);
</script>

<Warning/>
<ONSHeader/>

<Section column="wide">

<div class="grid mtl">
	<div>
		<span class="text-med">
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.sex} on:change={loadData} style="width: {wSex && getWidth(wSex)}px">
				{#each options.sex as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>
			aged 
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.age} on:change={loadData} style="width: {wAge && getWidth(wAge)}px">
				{#each options.age as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>,
			of
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.ethnicity} on:change={loadData} style="width: {wEthnicity && getWidth(wEthnicity)}px">
				{#each options.ethnicity as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>
			ethnicity, 
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.religion} on:change={loadData} style="width: {wReligion && getWidth(wReligion)}px">
				{#each options.religion as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>
			religion, born 
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.born} on:change={loadData} style="width: {wBorn && getWidth(wBorn)}px">
				{#each options.born as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>, 
			and speaking English 
			<!-- svelte-ignore a11y-no-onchange -->
			<select bind:value={selected.english} on:change={loadData} style="width: {wEnglish && getWidth(wEnglish)}px">
				{#each options.english as item}
				<option value={item}>{item.label}</option>
				{/each}
			</select>
			.
		</span>
		{#if sum.all != sum.selected}
		<br/>Compared with overall population of England and Wales
		{/if}
	</div>
</div>

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
		<div class="text-small muted">vs {getMedianAge(data.all)} years for overall population</div>
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

<div class="text-med hidden" aria-hidden="true" bind:clientWidth={wSex}>{selected.sex ? selected.sex.label : ''}</div>
<div class="text-med hidden" aria-hidden="true" bind:clientWidth={wAge}>{selected.age ? selected.age.label : ''}</div>
<div class="text-med hidden" aria-hidden="true" bind:clientWidth={wEthnicity}>{selected.ethnicity ? selected.ethnicity.label : ''}</div>
<div class="text-med hidden" aria-hidden="true" bind:clientWidth={wReligion}>{selected.religion ? selected.religion.label : ''}</div>
<div class="text-med hidden" aria-hidden="true" bind:clientWidth={wBorn}>{selected.born ? selected.born.label : ''}</div>
<div class="text-med hidden" aria-hidden="true" bind:clientWidth={wEnglish}>{selected.english ? selected.english.label : ''}</div>
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
	select {
		margin: 0;
		padding: 0 0.2em;
		font-weight: bold;
		background-color: #eee;
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