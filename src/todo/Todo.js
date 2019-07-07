import React from 'react';
import { connect } from 'react-redux';

import Responsive from 'react-responsive-decorator';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import axios from 'axios';

import './Todo.css';

class Todo extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            isMobile: false,
            todos: [],
            dialogTitle: '',
            input: '',
            displayDone: false,
            currentState: null,
            currentPicture: '',
            openDailog: false,
            submissionText: 'Ajouter'
        }

        this.addTodo = this.addTodo.bind(this);
        this.markAsDone = this.markAsDone.bind(this);
        this.markAsTodo = this.markAsTodo.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.editTodo = this.editTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.randomTodo = this.randomTodo.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleButtonPressed = this.handleButtonPressed.bind(this);
        this.handleChangeDisplay = this.handleChangeDisplay.bind(this);
    }

    componentDidMount() {
        this.props.media({ minWidth: 768 }, () => {
            this.setState({
                isMobile: false
            });
        });
        
        this.props.media({ maxWidth: 768 }, () => {
            this.setState({
                isMobile: true
            });
        });

        if (!!localStorage.getItem('todos'))
            this.setState({ todos: JSON.parse(localStorage.getItem('todos')) });
    }

    componentWillUpdate () {
        localStorage.setItem('todos', JSON.stringify(this.state.todos));
    }

    addTodo () {
        this.setState({
            dialogTitle: 'Ajouter un todo',
            submissionText: 'Ajouter',
            input: '',
            openDailog: true
        });
    }

    editTodo(index) {
        this.setState ({
            input: this.state.todos[index].name,
            currentPicture: this.state.todos[index].picture,
            currentState: index,
            openDailog: true,
            dialogTitle: 'Mettre à jour un todo',
            submissionText: 'Modifier'
        });
    }

    saveTodo (description) {
        let todos = this.state.todos;

        if (this.state.currentState === null) { // add todo
            const self = this;
            let picture = '';
            axios.get('http://aws.random.cat/meow')
                .then(function (response) {
                    // handle success
                    picture = response.data.file;
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                    todos.push({
                        name: description,
                        picture: picture,
                        done: false,
                        date: ''
                    });
                    
                    self.setState({
                        todos: todos,
                        currentState: null,
                        input: '',
                        openDailog: false
                    });
                });
        } else { // edit a todo
            todos[this.state.currentState].name = description;
            
            this.setState({
                todos: todos,
                currentState: null,
                input: '',
                openDailog: false
            });
        }
    }

    markAsDone(index) {
        // var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        var todos = this.state.todos;
        todos[index].done = true;
        todos[index].date = new Date().toUTCString();//.toLocaleString();
        // todos[index].date = new Date().toLocaleDateString('fr-FR', dateOptions) + ' ' + new Date().toLocaleTimeString();
        this.setState({ todos: todos});
    }

    markAsTodo(index) {
        var todos = this.state.todos;
        todos[index].done = false;
        todos[index].date = '';
        this.setState({ todos: todos});
    }

    handleKeyPressed(event) {
        let keyPressedCode = event.which || event.keyCode;
        if (keyPressedCode === 13 && event.target.value.length !== 0) {
            this.saveTodo(event.target.value);
        }
    }

    handleButtonPressed (description) {
        this.saveTodo(description);
    }

    handleChange (event) {
        this.setState({
            input: event.target.value
        });
    }

    deleteTodo() {
        var todos = this.state.todos;
        todos.splice(this.state.currentState, 1);
        this.setState ({
            todos: todos,
            openDailog: false,
            currentState: null
        });
    }

    getRandomInt(min, max) {
        // min = Math.ceil(min);
        // max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    randomTodo() {
        const ACTIONS = [
            'eat',
            'sleep',
            'sell',
            'buy',
            'destroy',
            'throw',
            'bury',
        ];

        const OBJECTS = [
            'the banana',
            'the dog',
            'a fireman',
            'a dancing guy',
            'Station F',
            'the coffin',
        ];

        let description = ACTIONS[this.getRandomInt(0, ACTIONS.length)] + ' ' + OBJECTS[this.getRandomInt(0, OBJECTS.length)];
        this.saveTodo(description);
    }

    handleClose() {
        this.setState({
            openDailog: false,
            currentState: null
        });
    }

    handleChangeDisplay(event) {
        this.setState({ displayDone: event.target.value });
    }

    render() {
        const { isMobile } = this.state;
        return (
            <div className="body">
                <div className={ isMobile ? "content mobile" : "content content-full" }>
                    <div className={ isMobile ? "title mobile" : "title title-full" }>TODO APP</div>
                    
                    <div className="todo">
                        <span>SELECT A TYPE OF TASKS</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <FormControl>
                            <Select
                                value={this.state.displayDone}
                                onChange={this.handleChangeDisplay}
                                displayEmpty >
                                <MenuItem value={false}>To do</MenuItem>
                                <MenuItem value={true}>Done</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div>
                        <table className={ isMobile ? "table" : "table table-full" }>
                            <tbody>
                            {
                                this.state.todos.map(function(todo, index) {
                                    let todoItem = todo.done === this.state.displayDone ?
                                                <tr key={index} className="myTableItem">
                                                    { !this.state.displayDone ?
                                                        <td><input type="checkbox" onChange={() => this.markAsDone(index)} /></td> :
                                                        <td><input type="checkbox" onChange={() => this.markAsTodo(index)} checked /></td> }
                                                    
                                                    <td><Avatar alt="Remy Sharp" src={todo.picture} className="avatar" /></td>
                                                    
                                                    { !this.state.displayDone ?
                                                        <td onClick={() => this.editTodo(index)}><span>{todo.name}</span></td> :
                                                        <td onClick={() => this.editTodo(index)}><span>{todo.name} ({ todo.date })</span></td> }
                                                </tr> : null ;
                                    return todoItem;
                                }, this)
                            }
                            </tbody>
                        </table>

                        <br />
                        <div>
                            <Button onClick={this.addTodo} color="primary" variant="contained">
                                Add a todo
                            </Button>
                            &nbsp;&nbsp;
                            <Button onClick={this.randomTodo} color="primary" variant="outlined">
                                Add a random todo
                            </Button>
                        </div>
                    </div>

                    <Dialog open={this.state.openDailog} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">{this.state.dialogTitle}</DialogTitle>

                        <DialogContent>
                            <img alt={this.state.currentPicture} src={this.state.currentPicture} className="big-avatar" style={{ display: this.state.currentState !== null ? "block" : "none" }} />
                            <br />

                            <TextField
                                autoFocus
                                label="Decription"
                                type="text"
                                value={this.state.input}
                                onChange={this.handleChange}
                                onKeyUp={this.handleKeyPressed}
                                fullWidth
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={this.deleteTodo} color="secondary" variant="outlined" style={{ display: this.state.currentState !== null ? "block" : "none" }}>
                                Delete
                            </Button>
                            <Button onClick={() => this.handleButtonPressed(this.state.input)} color="primary" variant="contained">
                                {this.state.submissionText}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }

}

export default Responsive(Todo);