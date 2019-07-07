const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    description: action.text,
                    picture: action.picture,
                    done: false,
                    date: ''
                }
            ];

        case 'EDIT_TODO':
            return [];

        case 'TOGGLE_TODO':
            return state.map(todo =>
                todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
            );

        default:
            return state;
    }
}

export default todos
