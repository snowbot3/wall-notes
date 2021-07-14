// TODO: Return to original theming style
import { css } from './wall.js';

const theme = {
	head: {
		bg: '#8ce',
		color: 'black'
	},
	side: {
		bg: '#f8f8ff'
	},
	radius: '10px'
};

css(`
.th-head {
	background: ${theme.head.bg};
	color: ${theme.head.color};
}
.th-body {
	border: 1px solid #aaa;
}
.th-side {
	background: ${theme.side.bg};
}
.th-even> :nth-child(even) {
	background: ${theme.side.bg};
}
.th-corner {
	border-radius: ${theme.radius};
}
.th-corner-top {
	border-top-left-radius: ${theme.radius};
	border-top-right-radius: ${theme.radius};
}
.th-corner-bottom {
	border-bottom-left-radius: ${theme.radius};
	border-bottom-right-radius: ${theme.radius};
}
`);
