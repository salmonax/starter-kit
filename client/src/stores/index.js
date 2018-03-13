import Common from './common';

export const stores = (state = {}) => ({
	common: new Common(state.common),
});

export default stores();