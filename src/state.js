import { pubsub } from './pubsub.js';

const state = {
	workingList: null,
	workingTodo: null,
	setWorkingList: (listName) => {
		state.workingList = listName;
	},
	setWorkingTodo: (todoName) => {
		state.workingTodo = todoName;
	},
	clearWorkingTodo: () => {
		state.workingTodo = '';
	}
};

pubsub.subscribe('listSelected', state.setWorkingList);
pubsub.subscribe('firstListAdded', state.setWorkingList);
pubsub.subscribe('editTodoBtnClicked', state.setWorkingTodo);

export { state };
