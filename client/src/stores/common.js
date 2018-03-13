import { observable, action } from 'mobx';

export default class Common {
	constructor(state = {}) {
		Object.keys(state).forEach(key => this[key] = key);
	}
  @observable whatever = 'urudo'
  @action.bound setWhatever(newThing) {
    this.whatever = newThing;
  }

}