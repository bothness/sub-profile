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
	comparison: 'vs overall population',
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
			{ key: 'grade', code: 'SCGPUK11C' }
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
		label: "place of birth",
		cats: [
			{var: 'COB_T003B', code: '1-5', label: 'United Kingdom'},
			{
				var: "COBG",
				indent: 1,
				code: "1",
				label: "England"
			},
			{
				var: "COBG",
				indent: 1,
				code: "2",
				label: "Scotland"
			},
			{
				var: "COBG",
				indent: 1,
				code: "3",
				label: "Northern Ireland"
			},
			{
				var: "COBG",
				indent: 1,
				code: "4",
				label: "Wales"
			},
			{
				var: "COBG",
				indent: 1,
				code: "5",
				label: "United Kingdom not otherwise specified"
			},
			{var: 'COB_T003B', code: '6-26', label: 'outside the UK'},
			{
				var: "COBG",
				indent: 1,
				code: "6",
				label: "Ireland"
			},
			{
				var: "COB_R010A",
				code: "7,9",
				indent: 1,
				label: "EU countries since 2001"
			},
			{
				var: "COBG",
				indent: 2,
				code: "7",
				label: "Germany"
			},
			{
				var: "COBG",
				indent: 2,
				code: "9",
				label: "Other EU countries since 2001"
			},
			{
				var: "COB_R010A",
				code: "8,10",
				indent: 1,
				label: "EU countries since 2011"
			},
			{
				var: "COBG",
				indent: 2,
				code: "8",
				label: "Poland"
			},
			{
				var: "COBG",
				indent: 2,
				code: "10",
				label: "Other EU countries since 2011"
			},
			{
				var: "COBG",
				indent: 1,
				code: "11",
				label: "Rest of Europe"
			},
			{
				var: "COB_R010A",
				indent: 1,
				code: "12-15",
				label: "Africa"
			},
			{
				var: "COBG",
				indent: 2,
				code: "12",
				label: "North Africa"
			},
			{
				var: "COBG",
				indent: 2,
				code: "13",
				label: "Central and Western Africa"
			},
			{
				var: "COBG",
				indent: 2,
				code: "14",
				label: "South and Eastern Africa"
			},
			{
				var: "COBG",
				indent: 2,
				code: "15",
				label: "Africa not otherwise specified"
			},
			{
				var: "COB_R010A",
				code: "16-23",
				indent: 1,
				label: "Middle East and Asia"
			},
			{
				var: "COBG",
				indent: 2,
				code: "16",
				label: "Middle East"
			},
			{
				var: "COBG",
				indent: 2,
				code: "17",
				label: "Eastern Asia"
			},
			{
				var: "COBG",
				indent: 2,
				code: "18",
				label: "Bangladesh"
			},
			{
				var: "COBG",
				indent: 2,
				code: "19",
				label: "India"
			},
			{
				var: "COBG",
				indent: 2,
				code: "20",
				label: "Pakistan"
			},
			{
				var: "COBG",
				indent: 2,
				code: "21",
				label: "Rest of Southern Asia"
			},
			{
				var: "COBG",
				indent: 2,
				code: "22",
				label: "Middle East and Asia: South-East Asia"
			},
			{
				var: "COBG",
				indent: 2,
				code: "23",
				label: "Middle East and Asia: Central Asia"
			},
			{
				var: "COB_R010A",
				code: "24-25",
				indent: 1,
				label: "The Americas and the Caribbean"
			},
			{
				var: "COBG",
				indent: 2,
				code: "24",
				label: "North America and the Caribbean"
			},
			{
				var: "COBG",
				indent: 2,
				code: "25",
				label: "Central and South America"
			},
			{
				var: "COBG",
				indent: 1,
				code: "26",
				label: "Antarctica, Oceania (including Australasia) and other"
			}
		]
	},
	{
		label: "religion",
		cats: [
			{var: 'RELIGIONEW', code: '1', label: 'no religion'},
			{var: 'RELIGIONEW', code: '2', label: 'Christian'},
			{var: 'RELIGIONEW', code: '3', label: 'Buddhist'},
			{var: 'RELIGIONEW', code: '4', label: 'Hindu'},
			{var: 'RELIGIONEW', code: '5', label: 'Jewish'},
			{var: 'RELIGIONEW', code: '6', label: 'Muslim'},
			{var: 'RELIGIONEW', code: '7', label: 'Sikh'},
			{var: 'RELIGIONEW', code: '8', label: 'Other'},
			{var: 'RELIGIONEW', code: '9', label: 'not stated'}
		]
	},
	{
		label: "english proficiency",
		cats: [
			{var: 'LANGPRF_R006A', code: '1', label: 'native speaker'},
			{var: 'LANGPRF_R006A', code: '2', label: 'speaks very well'},
			{var: 'LANGPRF_R006A', code: '3', label: 'speaks well'},
			{var: 'LANGPRF_R006A', code: '4', label: 'cannot speak well'},
			{var: 'LANGPRF_R006A', code: '5', label: 'speaks no English'}
		]
	},
	{
		label: "age",
		cats: [
			{var: 'AGE_T005B', code: '0-15', label: '0 to 15'},
			{var: 'AGE_T005B', code: '16-49', label: '16 to 49'},
			{var: 'AGE_T005B', code: '50-64', label: '50 to 64'},
			{var: 'AGE_T005B', code: '65-90', label: '65 plus'}
		]
	}
];

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
};

export const mapStyle = 'https://bothness.github.io/ons-basemaps/data/style-omt.json';
export const ladBounds = {
	url: "./data/lad2015.json",
	layer: "LAD15merc",
	code: "AREACD",
	name: "AREANM"
}