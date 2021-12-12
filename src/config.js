export const themes = {
  'light': {
		'name': 'light',
    'text': '#222',
    'muted': '#777',
    'pale': '#f0f0f0',
    'background': '#fff'
  },
  'dark': {
		'name': 'dark',
    'text': '#fff',
    'muted': '#bbb',
    'pale': '#333',
    'background': '#222'
  }
};

export const texts = {
	comparison: 'vs whole population',
	nodata: 'Data not available.'
};

export const urls = {
	names: './data/msoa11-names.csv'
};

export const colors = {
	cat: ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'],
	seq: ["#d5f690", "#5bc4b1", "#2e9daa", "#0079a2", "#005583"],
	nodata: "#999"
};
export const spacer = '&nbsp;&nbsp;&nbsp;&nbsp;';
export const arrow = '&rtrif;&nbsp;&nbsp;'

export const datasets = [
	{
		key: 'residents',
		code: 'Usual-Residents',
		tables: [
			{ key: 'age', code: 'AGE' },
			{ key: 'economic', code: 'ECOPUK11_R006A' },
			{ key: 'travel', code: 'TRANSPORT' },
			{ key: 'distance', code: 'AGGDTWPEW11_R010A' },
			{ key: 'health', code: 'HEALTH' },
			{ key: 'grade', code: 'SCGPUK11C' },
			{ key: 'marital', code: "MARSTAT"}
		]
	},
	{
		key: 'households',
		code: 'Household-Ref-Persons',
		tables: [
			{ key: 'housing', code: 'TYPACCOM' },
			{ key: 'tenure', code: 'TENHUK11' }
		]
	}
];

export const vars = [
	{
		label: "sex",
		cats: [
			{var: 'SEX', code: '2', label: 'female'},
			{var: 'SEX', code: '1', label: 'male'}
		]
	},
	{
		label: "ethnicity",
		cats: [
			{var: 'ETHPUK11_T006A', code: '1-4', label: 'white'},
			{var: 'ETHNICITYEW', code: '1', label: 'white UK', indent: 1},
			{var: 'ETHNICITYEW', code: '2', label: 'white Irish', indent: 1},
			{var: 'ETHNICITYEW', code: '3', label: 'white Gypsy/traveller', indent: 1},
			{var: 'ETHPUK11_T006A', code: '5-8', label: 'mixed'},
			{var: 'ETHNICITYEW', code: '5', label: 'mixed Caribbean/white', indent: 1},
			{var: 'ETHNICITYEW', code: '6', label: 'mixed African/white', indent: 1},
			{var: 'ETHNICITYEW', code: '7', label: 'mixed Asian/white', indent: 1},
			{var: 'ETHPUK11_T006A', code: '9-13', label: 'Asian'},
			{var: 'ETHNICITYEW', code: '9', label: 'Indian', indent: 1},
			{var: 'ETHNICITYEW', code: '10', label: 'Pakistani', indent: 1},
			{var: 'ETHNICITYEW', code: '11', label: 'Bangladeshi', indent: 1},
			{var: 'ETHNICITYEW', code: '12', label: 'Chinese', indent: 1},
			{var: 'ETHPUK11_T006A', code: '14-16', label: 'black'},
			{var: 'ETHNICITYEW', code: '14', label: 'black African', indent: 1},
			{var: 'ETHNICITYEW', code: '15', label: 'black Caribbean', indent: 1},
			{var: 'ETHPUK11_T006A', code: '17-18', label: 'other'},
			{var: 'ETHNICITYEW', code: '17', label: 'Arab', indent: 1},
			{var: 'ETHNICITYEW', code: '18', label: 'other', indent: 1}
		]
	},
	{
		label: "country of birth",
		cats: [
			{var: 'COB_T003B', code: '1-5', label: 'United Kingdom'},
			{var:"COBG",indent:1,code:"1",label:"England"},
			{var:"COBG",indent:1,code:"2",label:"Scotland"},
			{var:"COBG",indent:1,code:"3",label:"Northern Ireland"},
			{var:"COBG",indent:1,code:"4",label:"Wales"},
			{var:"COBG",indent:1,code:"5",label:"United Kingdom not otherwise specified"},
			{var:"COB_T003B",code:"6-26",label:"outside the UK"},
			{var:"COBG",indent:1,code:"6",label:"Ireland"},
			{var:"COB_R010A",code:"7,9",indent:1,label:"EU countries as of 2001"},
			{var:"COBG",indent:2,code:"7",label:"Germany"},
			{var:"COBG",indent:2,code:"9",label:"Other EU countries as of 2001"},
			{var:"COB_R010A",code:"8,10",indent:1,label:"EU countries as of 2011"},
			{var:"COBG",indent:2,code:"8",label:"Poland"},
			{var:"COBG",indent:2,code:"10",label:"Other EU countries as of 2011"},
			{var:"COBG",indent:1,code:"11",label:"Rest of Europe"},
			{var:"COB_R010A",indent:1,code:"12-15",label:"Africa"},
			{var:"COBG",indent:2,code:"12",label:"North Africa"},
			{var:"COBG",indent:2,code:"13",label:"Central and Western Africa"},
			{var:"COBG",indent:2,code:"14",label:"South and Eastern Africa"},
			{var:"COBG",indent:2,code:"15",label:"Africa not otherwise specified"},
			{var:"COB_R010A",code:"16-23",indent:1,label:"Middle East and Asia"},
			{var:"COBG",indent:2,code:"16",label:"Middle East"},
			{var:"COBG",indent:2,code:"17",label:"Eastern Asia"},
			{var:"COBG",indent:2,code:"18",label:"Bangladesh"},
			{var:"COBG",indent:2,code:"19",label:"India"},
			{var:"COBG",indent:2,code:"20",label:"Pakistan"},
			{var:"COBG",indent:2,code:"21",label:"Rest of Southern Asia"},
			{var:"COBG",indent:2,code:"22",label:"Middle East and Asia: South-East Asia"},
			{var:"COBG",indent:2,code:"23",label:"Middle East and Asia: Central Asia"},
			{var:"COB_R010A",code:"24-25",indent:1,label:"The Americas and the Caribbean"},
			{var:"COBG",indent:2,code:"24",label:"North America and the Caribbean"},
			{var:"COBG",indent:2,code:"25",label:"Central and South America"},
			{var:"COBG",indent:1,code:"26",label:"Antarctica, Oceania and other"}
		]
	},
	{
		label: "religion",
		cats: [
			{var: 'RELIGIONEW', code: '1', label: 'no religion'},
			{var: 'RELIGIONEW', code: '2', label: 'Christian'},
			{var: 'RELPUK11_R005A', code: '3-8', label: 'other religion'},
			{var: 'RELIGIONEW', code: '3', label: 'Buddhist', indent: 1},
			{var: 'RELIGIONEW', code: '4', label: 'Hindu', indent: 1},
			{var: 'RELIGIONEW', code: '5', label: 'Jewish', indent: 1},
			{var: 'RELIGIONEW', code: '6', label: 'Muslim', indent: 1},
			{var: 'RELIGIONEW', code: '7', label: 'Sikh', indent: 1},
			{var: 'RELIGIONEW', code: '8', label: 'other', indent: 1},
			{var: 'RELIGIONEW', code: '9', label: 'not stated'}
		]
	},
	{
		label: "English proficiency",
		cats: [
			{var: 'LANGPRF_R006A', code: '1', label: 'English is main language'},
			{var: 'LANGPRF_R006A', code: '2', label: 'speaks English very well'},
			{var: 'LANGPRF_R006A', code: '3', label: 'speaks English well'},
			{var: 'LANGPRF_R006A', code: '4', label: 'cannot speak English well'},
			{var: 'LANGPRF_R006A', code: '5', label: 'speaks no English'}
		]
	},
	{
		label: "age group",
		cats: [
			{var: 'AGE_T005B', code: '0-15', label: '0 to 15'},
			{var: 'AGE_T005B', code: '16-49', label: '16 to 49'},
			{var: 'AGE_T005B', code: '50-64', label: '50 to 64'},
			{var: 'AGE_T005B', code: '65-90', label: '65 plus'}
		]
	},
	{
		label:"arrival in UK",
		cats: [
			{var: 'YRARRPUK11_R006A', code: '1', label: 'Born in the UK'},
			{var: 'YRARRPUK11_R006A', code: '2', label: 'Before 1981'},
			{var: 'YRARRPUK11_R011A', code: '2', label: 'Before 1961', indent: 1},
			{var: 'YRARRPUK11_R011A', code: '3', label: '1961-1970', indent: 1},
			{var: 'YRARRPUK11_R011A', code: '3', label: '1971-1980', indent: 1},
			{var: 'YRARRPUK11_R006A', code: '3', label: '1981-1990'},
			{var: 'YRARRPUK11_R006A', code: '4', label: '1991-2000'},
			{var: 'YRARRPUK11_R006A', code: '5', label: '2001-2011'},
			{var: 'YRARRPUK11_R011A', code: '7', label: '2001-2003', indent: 1},
			{var: 'YRARRPUK11_R011A', code: '8', label: '2004-2006', indent: 1},
			{var: 'YRARRPUK11_R011A', code: '9', label: '2007-2009', indent: 1},
			{var: 'YRARRPUK11_R011A', code: '10', label: '2010-2011', indent: 1}
		]
	},
	{
		label: "passport held",
		cats: [
			{var: 'PSSPUK_R004A', code: '1', label: 'UK passport'},
			{var: 'PSSPUK_R004A', code: '2-41', label: 'non-UK passport'},
			{var: 'PSSPUK_R011A', code: "2", indent: 1, label: "Ireland"},
			{var: 'PSSPUK_R011A', code: "3-7", indent: 1, label: "EU countries as of 2001"},
			{var: 'PSSPUK', code: "3", indent: 2, label: "France"},
			{var: 'PSSPUK', code: "4", indent: 2, label: "Germany"},
			{var: 'PSSPUK', code: "5", indent: 2, label: "Italy"},
			{var: 'PSSPUK', code: "6", indent: 2, label: "Portugal"},
			{var: 'PSSPUK', code: "7", indent: 2, label: "other EU countries as of 2001"},
			{var: 'PSSPUK_R011A', code: "8-10", indent: 1, label: "EU countries as of 2011"},
			{var: 'PSSPUK', code: "8", indent: 2, label: "Lithuania"},
			{var: 'PSSPUK', code: "9", indent: 2, label: "Poland"},
			{var: 'PSSPUK', code: "10", indent: 2, label: "other EU countries as of 2011"},
			{var: 'PSSPUK_R011A', code: "11", indent: 1, label: "Rest of Europe"},
			{var: 'PSSPUK_R011A', code: "12-20", indent: 1, label: "Africa"},
			{var: 'PSSPUK_R018A', code: "12", indent: 2, label: "North Africa"},
			{var: 'PSSPUK_R018A', code: "13-15", indent: 2, label: "Central and Western Africa"},
			{var: 'PSSPUK', code: "13", indent: 3, label: "Ghana"},
			{var: 'PSSPUK', code: "14", indent: 3, label: "Nigeria"},
			{var: 'PSSPUK', code: "15", indent: 3, label: "Central Africa & other Western Africa"},
			{var: 'PSSPUK_R018A', code: "16-20", indent: 2, label: "South and Eastern Africa"},
			{var: 'PSSPUK', code: "16", indent: 3, label: "Kenya"},
			{var: 'PSSPUK', code: "17", indent: 3, label: "Somalia"},
			{var: 'PSSPUK', code: "18", indent: 3, label: "Other Eastern Africa"},
			{var: 'PSSPUK', code: "19", indent: 3, label: "South Africa"},
			{var: 'PSSPUK', code: "20", indent: 3, label: "Other Southern Africa"},
			{var: 'PSSPUK_R011A', code: "21-31", indent: 1, label: "Middle East and Asia"},
			{var: 'PSSPUK_R018A', code: "21", indent: 2, label: "Middle East"},
			{var: 'PSSPUK_R018A', code: "22-23", indent: 2, label: "Eastern Asia"},
			{var: 'PSSPUK', code: "22", indent: 3, label: "China"},
			{var: 'PSSPUK', code: "23", indent: 3, label: "Other Eastern Asia"},
			{var: 'PSSPUK_R018A', code: "24-28", indent: 2, label: "Southern Asia"},
			{var: 'PSSPUK', code: "24", indent: 3, label: "Bangladesh"},
			{var: 'PSSPUK', code: "25", indent: 3, label: "India"},
			{var: 'PSSPUK', code: "26", indent: 3, label: "Pakistan"},
			{var: 'PSSPUK', code: "27", indent: 3, label: "Sri Lanka"},
			{var: 'PSSPUK', code: "28", indent: 3, label: "Other Southern Asia"},
			{var: 'PSSPUK_R018A', code: "29-30", indent: 2, label: "South-East Asia"},
			{var: 'PSSPUK', code: "29", indent: 3, label: "Philippines"},
			{var: 'PSSPUK', code: "30", indent: 3, label: "Other South-East Asia"},
			{var: 'PSSPUK_R018A', code: "31", indent: 2, label: "Central Asia"},
			{var: 'PSSPUK_R011A', code: "32-37,41", indent: 1, label: "The Americas and the Caribbean"},
			{var: 'PSSPUK_R018A', code: "32,33,36,37,41", indent: 2, label: "North America and the Caribbean"},
			{var: 'PSSPUK', code: "32", indent: 3, label: "Canada"},
			{var: 'PSSPUK', code: "33", indent: 3, label: "United States"},
			{var: 'PSSPUK', code: "36", indent: 3, label: "Jamaica"},
			{var: 'PSSPUK', code: "37", indent: 3, label: "Other Caribbean"},
			{var: 'PSSPUK', code: "41", indent: 3, label: "British Overseas Territories"},
			{var: 'PSSPUK_R018A', code: "34-35", indent: 2, label: "Central and South America"},
			{var: 'PSSPUK', code: "34", indent: 3, label: "Central America"},
			{var: 'PSSPUK', code: "35", indent: 3, label: "South America"},
			{var: 'PSSPUK_R011A', code: "38-40", indent: 1, label: "Antarctica and Oceania"},
			{var: 'PSSPUK', code: "38", indent: 2, label: "Australia"},
			{var: 'PSSPUK', code: "39", indent: 2, label: "New Zealand"},
			{var: 'PSSPUK', code: "40", indent: 2, label: "Other Oceania"},
			{var: 'PSSPUK_R004A', code: '42', label: 'no passport held'},
		] 
	}
].sort((a, b) => a.label.localeCompare(b.label));

export const codes = {
	age: [
		{label: '0-9', cells: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{label: '10-19', cells: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]},
		{label: '20-29', cells: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]},
		{label: '30-39', cells: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39]},
		{label: '40-49', cells: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]},
		{label: '50-59', cells: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]},
		{label: '60-69', cells: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69]},
		{label: '70+', cells: [70, 71, 72, 73, 74]}
	],
	distance: [
		{label: '0-2', cells: [0]},
		{label: '2-5', cells: [1]},
		{label: '5-10', cells: [2]},
		{label: '10-20', cells: [3]},
		{label: '20-40', cells: [4]},
		{label: '40-60', cells: [5]},
		{label: '60+', cells: [6]}
	],
	economic: [
		{label: 'employee', cells: [0]},
		{label: 'self-employed', cells: [1]},
		{label: 'student (employed)', cells: [2]},
		{label: 'unemployed', cells: [3]},
		{label: 'inactive', cells: [4]}
	],
	grade: [
		{label: 'AB', cells: [0]},
		{label: 'C1', cells: [1]},
		{label: 'C2', cells: [2]},
		{label: 'DE', cells: [3]}
	],
	health: [
		{label: 'good', cells: [0, 1]},
		{label: 'fair', cells: [2]},
		{label: 'bad', cells: [3, 4]},
	],
	travel: [
		{label: 'train/metro', cells: [1, 2]},
		{label: 'bus', cells: [3]},
		{label: 'taxi', cells: [4]},
		{label: 'car/van', cells: [6, 7]},
		{label: 'motorbike/scooter', cells: [5]},
		{label: 'bicycle', cells: [8]},
		{label: "on foot", cells: [9]},
		{label: 'work from home', cells: [0]},
		{label: "other", cells: [10]}
	],
	housing: [
		{label: 'house/bungalow', cells: [0, 1, 2]},
		{label: 'flat/maisonette/apartment', cells: [3, 4, 5]},
		{label: 'caravan/mobile/temporary home', cells: [6]}
	],
	tenure: [
		{label: 'owner occupied', cells: [0, 1]},
		{label: 'shared ownership', cells: [2]},
		{label: 'rented (private)', cells: [5, 6, 7]},
		{label: 'rented (social)', cells: [3, 4]},
		{label: 'rent free', cells: [9]},
		{label: 'other', cells: [8]}
	],
	marital: [
		{label: 'Single (never married)', cells: [0]},
		{label: 'Married/civil partnership', cells: [1, 2]},
		{label: 'Separated', cells: [3]},
		{label: 'Divorced', cells: [4]},
		{label: 'Widowed', cells: [5]}
	]
};

export const mapStyle = 'https://bothness.github.io/ons-basemaps/data/style-omt.json';
export const ladBounds = {
	url: "./data/lad2015.json",
	layer: "LAD15merc",
	code: "AREACD",
	name: "AREANM"
}