import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

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
  }
});
