import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './notification.html';

Template.notification.events({
    'click .notification': function(event){
        event.preventDefault();
        $('.notification').fadeOut();
        Session.set('successNotification', false);
        Session.set('errorNotification', false);
    }
});

Template.notification.helpers({
  message: function () {
    return Session.get('notificationMessage');
  },
  successNotification: function () {
    return Session.get('successNotification');
  },
  errorNotification: function () {
    return Session.get('errorNotification');
  }
});
