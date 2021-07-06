// import { csvParse, autoType } from 'd3-dsv';

const endpoint = 'https://ftb-api-ext.ons.sensiblecode.io/graphql';
const credentials = btoa("ahmad.barclay"+":"+"elope.puck.hails.explore");
const headers = new Headers({
  "Content-Type": "application/json",
  "Authorization": "Basic " + credentials
});

// new Headers(JSON.parse(atob(headers)))

export async function getData(datasets, selected = null) {
  let keys;
  let variables = [];
  let filters = [];
  if (selected) {
    keys = Object.keys(selected);
    keys.forEach(key => {
      if (selected[key].var) {
        variables.push(selected[key].var);
        filters.push(`{variable: "${selected[key].var}", codes: ["${selected[key].code}"]}`);
      }
    });
  }
  let vars = variables[0] ? '"' + variables.join('","') + '",' : '';
  filters = filters[0] ? '[' + filters.join(',') + ']' : '[]';

  let dats = [];
  datasets.forEach(dat => {
    let tabs = [];
    dat.tables.forEach(tab => {
      tabs.push(`
      ${tab.key}: table(
        variables: [${vars}"${tab.code}"]
        filters: ${filters}
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
  return json;
}

export async function getGeo(options, selected, keys, variables = []) {
  const string = variables[0] ? ',"' + variables.join('","') + '"' : '';
  let filters = [];

  keys.forEach(key => {
    if (variables.includes(options[key].code)) {
      filters.push(`{variable: "${options[key].code}", codes: ${'["' + selected[key].code + '"]'}}`)
    }
  });

  filters = filters[0] ? '[' + filters.join(',') + ']' : '[]';

  const query = `
  query {
    dataset(name:"Usual-Residents") {
      table(
        variables: ["MSOA"${string}]
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