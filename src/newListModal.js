import { pubsub } from './pubsub.js';
import { data } from './data.js';

const initNewListModal = () => {
	const newListModal = document.querySelector('.new-list-modal');
	let listName = document.querySelector('.new-list-modal input');

	const newListBtn = document.querySelector('.new-list');
	newListBtn.addEventListener('click', () => {
		pubsub.publish('newListBtnClicked');
	});

	const cancel = document.querySelector('.new-list-modal .cancel');
	cancel.addEventListener('click', () => {
		listName.value = '';
		newListModal.close();
	});

	newListModal.addEventListener('submit', (event) => {
		event.preventDefault();
		if (
			!data.getList(listName.value) &&
			!listName.value.includes('`') &&
			listName.value != ''
		) {
			pubsub.publish('listAdded', listName.value);
			listName.value = '';
			newListModal.close();
		}
		else {
			alert("List name must: \n Not be the same as another list \n Not include backticks (`) \n Not be blank");
			return
		};
	});
};

export { initNewListModal };
