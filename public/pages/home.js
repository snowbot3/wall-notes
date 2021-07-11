import notes from '../notes/list.js';

// No reason to have async and await here except to note the promises passing through...
export default async function page() {
	return await notes();
}
