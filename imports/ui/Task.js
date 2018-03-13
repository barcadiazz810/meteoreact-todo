import React, { Component } from 'react';
import { Tasks } from '../api/tasks.js';
import classnames from 'classnames';

export default class Task extends Component {
  toggleChecked() {
    try{
      Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked,(error,result)=>{
        if(error){
          alert(error.error);
        }
      });
    }catch(e)
    {
    }

  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id,(error,result)=>{
      if(error){
        alert(error.error);
      }
    });
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  render() {
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });
    //const taskClassName = this.props.task.checked ? 'checked' : '';
    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
      </li>
    );
  }
}
