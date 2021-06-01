(function() {
    // Создание заголовка
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    // Создание формы
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        }
    };

    // Создание списка дел
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };

    // Создание дела
    function createTodoItem({name, done = false, index}) {
        let item = document.createElement('li');
        let text = document.createElement('p');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.setAttribute('data-index', index);
        text.innerHTML = name;
        item.append(text);
        if (done === true) {
            item.classList.add('list-group-item-success');
        };

        console.log(name, done, index);

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.setAttribute('data-toggle-id', 'list-item');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        
        item.append(buttonGroup);
        
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createTodoApp(container, title = 'Список дел', deeds) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        
        // проверка localStorage и создание массива дел
        let listArray;
        if (localStorage.getItem(title) != null) {
            listArray = JSON.parse(localStorage.getItem(title));
        } else {
            if (deeds) {
                listArray = deeds;
                localStorage.setItem(title, JSON.stringify(listArray)); 
                
            } else {
                listArray = []; 
                localStorage.setItem(title, JSON.stringify(listArray)); 
            }
        };

        // Заполнение списка дел
        let list = createTodoList();
        for ( let deed of listArray ) {
            list.append(createTodoItem(deed).item);
        }
        
        // Заполнение контейнера
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // Отключение кнопки "Добавить дело"
        if ( !todoItemForm.input.value ) {
            todoItemForm.button.setAttribute('disabled', 'disabled');
        };

        todoItemForm.input.addEventListener('keydown', function() {
            todoItemForm.button.removeAttribute('disabled');
        });

        todoItemForm.input.addEventListener('input', function() {
            if (todoItemForm.input.value == '') {
                todoItemForm.button.setAttribute('disabled', 'disabled');
            }
        });

        let index;
        if (listArray.length != 0) {
            index = listArray[listArray.length - 1].index + 1;
        } else {
            index = 0;
        }
        
        // Добавление нового дела в список
        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let value = { name: todoItemForm.form.querySelector('.form-control').value, done: false, index};
            let todoItem = createTodoItem(value);
            todoList.append(todoItem.item);

            // Добавление в массив
            listArray.push({ name: this.querySelector('.form-control').value, done: false, index});
            localStorage.setItem(title, JSON.stringify(listArray));
            index++;

            // Функционал кнопки "Готово"
            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');

                let id = this.parentElement.parentElement.dataset.index;
                let key = listArray[id];
                key.done = !key.done;
                localStorage.setItem(title, JSON.stringify(listArray));
            });

            // Функционал кнопки "Удалить"

            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();

                    let id = this.parentElement.parentElement.getAttribute("data-index");
                    for ( let i = 0; i < listArray.length; i++ ) {
                        if ( +listArray[i].index === +id ) {
                            listArray.splice(i, 1);
                        }
                    }
                                        
                    localStorage.setItem(title, JSON.stringify(listArray));
                    console.log(listArray);
                }
            });


            todoItemForm.input.value = '';
            todoItemForm.button.setAttribute('disabled', 'disabled');
        });
        
        console.log(localStorage);
     
        // Переотрисовка списка из localStorage
        listArray = JSON.parse(localStorage.getItem(title));
        console.log(listArray);
    
        for ( let i = 0; i < listArray.length; i++ ) {
            let key = listArray[i];
            let listItem = createTodoItem(key);
            
            // Функционал кнопки "Готово"
            listItem.doneButton.addEventListener('click', function() {
                listItem.item.classList.toggle('list-group-item-success');
                key.done = !key.done;
                localStorage.setItem(title, JSON.stringify(listArray));
            });

            // Функционал кнопки "Удалить"
            
            listItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    listItem.item.remove();
                    
                    listArray.splice(i, 1);
                    localStorage.setItem(title, JSON.stringify(listArray));
                }
            });
            

            todoList.append(listItem.item);
        };

        
    };

    window.createTodoApp = createTodoApp;
})();
