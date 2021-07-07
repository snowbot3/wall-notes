import { css, doms } from '../wall.js';
import theme from '../theme.js';

css(`
div.note {
	border: 1px solid;
	border-radius: ${theme.radius};
	display: flex;
	flex-direction: column;
}
div.note-head {
	background: ${theme.head.bg};
	border: 1px solid ${theme.head.bg};
	border-top-left-radius: ${theme.radius};
	border-top-right-radius: ${theme.radius};
	padding: 2px 5px;
}
div.note-body {
	padding: 2px 5px;
}
div.note-date {
	padding: 2px 5px;
	font-size: 0.8em;
	text-align: right;
}
`);

export default function note(note) {
	return doms(div=>div`class=note`(
		div`class=note-head`(note.id, ' ', note.tag),
		div`class=note-body`(note.note),
		div`class=note-date`(note.created)
	));
}