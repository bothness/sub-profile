import { csvParse, autoType } from 'd3-dsv';

const endpoint = 'https://ftb-api-ext.ons.sensiblecode.io/graphql';
const frag = `
fragment tableDimensions on Table {
  dimensions {
    categories {
      code
    }
  }
}
`.replace(/\s+/g, " ");
const credentials = btoa("ahmad.barclay"+":"+"elope.puck.hails.explore");
const headers = new Headers({
  "Content-Type": "application/json",
  "Authorization": "Basic " + credentials
});

// new Headers(JSON.parse(atob(headers)))

export async function getCSV(url) {
  let response = await fetch(url);
  let string = await response.text();
  return csvParse(string, autoType);
}

export async function getData(datasets, selected = null) {
  let variables = [];
  let filters = [];
  let altVariables = [];
  let altFilters = [];

  if (selected) {
    let keys = Object.keys(selected);
    keys.forEach(key => {
      if (selected[key].var) {
        variables.push(selected[key].var);
        filters.push(`{variable: "${selected[key].var}", codes: ["${selected[key].code}"]}`);
        
        if (key != 'age') {
          altVariables.push(selected[key].var);
          altFilters.push(`{variable: "${selected[key].var}", codes: ["${selected[key].code}"]}`);
        }
      }
    });
  }

  variables = variables[0] ? '"' + variables.join('","') + '",' : '';
  filters = filters[0] ? '[' + filters.join(',') + ']' : '[]';
  altVariables = altVariables[0] ? '"' + altVariables.join('","') + '",' : '';
  altFilters = altFilters[0] ? '[' + altFilters.join(',') + ']' : '[]';

  let dats = [];
  datasets.forEach(dat => {
    let tabs = [];
    dat.tables.forEach(tab => {
      tabs.push(`
      ${tab.key}: table(
        variables: [${tab.key == "age" ? altVariables : variables}"${tab.code}"]
        filters: ${tab.key == "age" ? altFilters : filters}
      )
      {
        values
      }
      `);
    });
    let string = `
    ${dat.key}: dataset(name:"${dat.code}") {
      ${tabs.join('\n')}
    }
    `
    dats.push(string);
  });

  const query = `
  query {
    ${dats.join('\n')}
  }
  `.replace(/\s+/g, " ");

	const ops = {
		body: JSON.stringify({
			"query": query
		}),
		headers: headers,
		method: "POST",
		mode: "cors"
	};
	
	let response = await fetch(endpoint, ops);
  let json = await response.json();

  // Hack for filtering single year age data
  if (selected.age.code && json.data.residents.age.values) {
    let ages = [...json.data.residents.age.values];
    let cells = selected.age.code.split('-');
    cells.forEach((d, i) => cells[i] = +d);
    ages.forEach((d, i) => ages[i] = i >= cells[0] && i <= cells[1] ? d : 0);
    json.data.residents.age.values = ages;
  }

  return json;
}

export async function getGeo(selected = null) {
  let variables = [];
  let filters = [];
  if (selected) {
    let keys = Object.keys(selected);
    keys.forEach(key => {
      if (selected[key].var) {
        variables.push(selected[key].var);
        filters.push(`{variable: "${selected[key].var}", codes: ["${selected[key].code}"]}`);
      }
    });
  }
  let vars = variables[0] ? '"' + variables.join('","') + '",' : '';
  filters = filters[0] ? '[' + filters.join(',') + ']' : '[]';

  const query = `
  query {
    dataset(name:"Usual-Residents") {
      table(
        variables: ["MSOA"${vars}]
        filters: ${filters}
      )
      {
        ...tableDimensions
        values
      }
    }
  }
  `.replace(/\s+/g, " ");

	const ops = {
		body: JSON.stringify({
			"query": query + frag
		}),
		headers: headers,
		method: "POST",
		mode: "cors"
	};
	
	let response = await fetch(endpoint, ops);
  let json = await response.json();
  return json;
}

export function getColor(value, breaks, colors) {
  for (let i = 1; i < breaks.length; i ++) {
    if (value <= breaks[i]) {
      return colors[i - 1];
    }
  }
}

export function suffixer(int) {
  let mod = Math.round(int) % 10;
  return mod == 1 ? 'st' : mod == 2 ? 'nd' : mod == 3 ? 'rd' : 'th';
}

export function changeClass(val) {
  return val > 0 ? 'increase' : val < 0 ? 'decrease' : 'nochange';
}

export function changeStr(val, suffix = '', decimals = 0) {
  return val != 0 ? Math.abs(val).toFixed(decimals) + suffix : suffix == 'pp' ? 'n/c' : 'no change';
}