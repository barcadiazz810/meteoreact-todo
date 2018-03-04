import React, { Component } from 'react';
import Task from './Task.js';
import { Tasks } from '../api/tasks.js';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

// App component - represents the whole app

class App extends Component {

  constructor(props){
    super(props);

    this.state={
      hideCompleted:false,
      disableInput:true,
      placeholderTxt:"Loading Tasks",
    }
  }

  // HIDE COMPLETED TASKS
  toggleHideCompleted(){
    this.setState({
      hideCompleted:!this.state.hideCompleted,
    })
  }
  // HIDE COMPLETED TASKS



  componentWillReceiveProps()
  {
    this.setState({
      disableInput:false,
      placeholderTxt:"Add a new task",
    })
  }


  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted)
    {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }


  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List {this.props.inCompleteTasks}</h1>

          <label className="hide-completed">
            <input type="checkbox" readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input type="text"
              ref="textInput"
              disabled={this.state.disableInput}
              placeholder={this.state.placeholderTxt}/>
          </form>
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(()=> {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    inCompleteTasks:Tasks.find({checked:{$ne:true}}).count(),
  };
})(App);
