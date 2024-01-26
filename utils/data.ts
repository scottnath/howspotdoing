/**
 * Clean up the is-thing-legal items to convert past dates to be legal-now
 * @param t {string} should be yes, no, or a date
 * @returns yes or a future date
 */
export const convertPastDateToYes = (t: string|Date, humanable=false): string|Date => {
	switch (t) {
		case 'yes':
		case 'no':
			return t;
		default:
			const d = new Date(t);
			if (d.toString() !== 'Invalid Date') {
				const n = new Date();
				const diff = Math.floor((+n - +d) / (1000 * 60 * 60 * 24));
				if (diff >= 0) {
					return 'yes'
				} else {
					if (humanable) {
						return diff*-1 + ' days'
					}
					return t;
				}
			} else {
				return 'no'
			}
	}
}
