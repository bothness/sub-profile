export const urls = {
		options: 'https://raw.githubusercontent.com/ONSvisual/census-data/main/csv/lists/places_2020.csv',
		places: 'https://raw.githubusercontent.com/ONSvisual/census-data/main/json/place/',
		quantiles: 'https://raw.githubusercontent.com/ONSvisual/census-data/main/json/quantiles/quartiles_'
};

export const colors = {
	cat: ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'],
	seq: ["#d5f690", "#5bc4b1", "#2e9daa", "#0079a2", "#005583"]
};

export const datasets = [
	{
		key: 'residents',
		code: 'Usual-Residents',
		tables: [
			{ key: 'age', code: 'AGE_T019B' },
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

export const options = {
	sex: [
		{label: 'People'},
		{var: 'SEX', code: '2', label: 'Females'},
		{var: 'SEX', code: '1', label: 'Males'}
	],
	ethnicity: [
		{label: 'any'},
		{var: 'ETHPUK11_T006A', code: '1-4', label: 'white (all)'},
		{var: 'ETHNICITYEW', code: '1', label: 'white UK'},
		{var: 'ETHNICITYEW', code: '2', label: 'white Irish'},
		{var: 'ETHNICITYEW', code: '3', label: 'white Gypsy/traveller'},
		{var: 'ETHPUK11_T006A', code: '5-8', label: 'mixed (all)'},
		{var: 'ETHNICITYEW', code: '5', label: 'mixed Caribbean/white'},
		{var: 'ETHNICITYEW', code: '6', label: 'mixed African/white'},
		{var: 'ETHNICITYEW', code: '7', label: 'mixed Asian/white'},
		{var: 'ETHPUK11_T006A', code: '9-13', label: 'Asian (all)'},
		{var: 'ETHNICITYEW', code: '9', label: 'Indian'},
		{var: 'ETHNICITYEW', code: '10', label: 'Pakistani'},
		{var: 'ETHNICITYEW', code: '11', label: 'Bangladeshi'},
		{var: 'ETHNICITYEW', code: '12', label: 'Chinese'},
		{var: 'ETHPUK11_T006A', code: '14-16', label: 'black (all)'},
		{var: 'ETHNICITYEW', code: '14', label: 'black African'},
		{var: 'ETHNICITYEW', code: '15', label: 'black Caribbean'},
		{var: 'ETHNICITYEW', code: '17', label: 'Arab'},
		{var: 'ETHNICITYEW', code: '18', label: 'other'}
	],
	born: [
		{label: 'born anywhere'},
		{var: 'COB_T003B', code: '1-5', label: 'born in UK'},
		{var: 'COB_T003B', code: '6-26', label: 'born outside UK'}
	]
}

export const codes = {
	age: [
		{label: '0-9', cells: [0, 1]},
		{label: '10-19', cells: [2, 3]},
		{label: '20-29', cells: [4, 5]},
		{label: '30-39', cells: [6, 7]},
		{label: '40-49', cells: [8, 9]},
		{label: '50-59', cells: [10, 11]},
		{label: '60-69', cells: [12, 13]},
		{label: '70+', cells: [14, 15, 16, 17]}
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
export const msoaBldg = {
	url: "https://cdn.ons.gov.uk/maptiles/buildings/v1/{z}/{x}/{y}.pbf",
	layer: "buildings",
	code: "msoa11cd"
};
export const msoaBounds = {
	url: "https://cdn.ons.gov.uk/maptiles/administrative/msoa/v2/boundaries/{z}/{x}/{y}.pbf",
	layer: "msoa",
	code: "areacd"
};