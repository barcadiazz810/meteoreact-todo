import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert'(text){
    // CHECK IF USER IS NOT LOGGED IN
    if(!this.userId)
    {
      throw new Meteor.Error('Not authorised');
    }

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner:this.userId,
      username:Meteor.users.findOne(this.userId).username
    });
  },

  'tasks.remove'(taskId){
    if(!this.userId)
    {
      throw new Meteor.Error('Not authorised');
    }
    check(taskId,String);
    Tasks.remove(taskId);
  },

  'tasks.setChecked'(taskId,setChecked){
    if(!this.userId)
    {
      throw new Meteor.Error('Not authorised');
    }
    check(taskId, String);
    check(setChecked, Boolean);
    Tasks.update(taskId, {
      $set: { checked: setChecked },
    });
  },

  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
    const task = Tasks.findOne(taskId);
    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});
