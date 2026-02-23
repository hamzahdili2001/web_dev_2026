import { API_TOKEN } from './config.js'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
}

/* fetch(
	'https://api.themoviedb.org/3/account/22803756/favorite/movies?language=en-US&page=1&sort_by=created_at.asc',
	options
)
	.then(res => res.json())
	.then(res => console.log(res))
	.catch(err => console.error(err)) */
