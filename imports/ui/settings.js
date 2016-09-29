import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './settings.html';

Template.settings.rendered = function() {
  Session.set('preferencePanelVisible', true);
}

Template.AccountLink.helpers({
  accountName: function() {
    var firstName = Meteor.user().profile.firstName;
    if (firstName) {
      return firstName;
    } else {
      var sample = "Traveler";
      return sample;
    }
  }
});

Template.settings.helpers({
  bannerMessage: function(){
    return Session.get('bannerMessage');
  },
  lastRoute: function() {
    var lastRoute = Session.get('lastRoute');
    if (lastRoute) {
      return lastRoute;
    } else {
      return "/library";
    }
  },
  preferencePanelVisible: function(){
    return Session.get('preferencePanelVisible');
  },
  userEmail: function(){
    var user = Meteor.user();
    if (user) {
      return user.emails[0].address;
    }
  },
  userRole: function(){
    var user = Meteor.user();
    if (user) {
      return user.roles;
    }
  },
  firstName: function() {
    var user = Meteor.user();
    if(user) {
      return user.profile.firstName;
    }
  },
  lastName: function() {
    var user = Meteor.user();
    if(user) {
      return user.profile.lastName;
    }
  }
});

Template.settings.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout(function (success, error) {
            FlowRouter.go('/');
        });
  },
  'click #myPreferenceLink': function(event){
      event.preventDefault();
      Session.set('preferencePanelVisible', true);
      $('.settings-nav li').removeClass( "active-link" );
      $('#myPreferenceLink').addClass( "active-link" );
  },
  'click #resetPasswordLink': function(event){
    event.preventDefault();
    Session.set('preferencePanelVisible', false);
    $('.settings-nav li').removeClass( "active-link" );
    $('#resetPasswordLink').addClass( "active-link" );
  },
  'submit #accountInfo': function(e, t) {
    e.preventDefault();
    var userId =  Meteor.userId();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    Meteor.call("updateUser", userId, firstName, lastName, function(error, r) {
      if (!error) {
        Session.set('notificationMessage', 'Updated profile!');
        Session.set('errorNotification', false);
        Session.set('successNotification', true);
      } else {
        Session.set('notificationMessage', 'Something went wrong, please double check your entry');
        Session.set('successNotification', false);
        Session.set('errorNotification', true);
      }
    });
    return false;
  },
  'submit #changePasswordForm': function(e, t) {
    e.preventDefault();

    var resetPasswordForm = $(e.currentTarget),
        oldPassword = resetPasswordForm.find('#oldPassword').val(),
        newPassword = resetPasswordForm.find('#newPassword').val();

    if (oldPassword !== '' && newPassword !== '') {
      Accounts.changePassword(oldPassword, newPassword, function(err) {
        if (err) {
          Session.set('notificationMessage', 'Something went wrong, please double check your entry');
          Session.set('successNotification', false);
          Session.set('errorNotification', true);
        } else {
          Session.set('notificationMessage', 'Your password has been updated!');
          Session.set('errorNotification', false);
          Session.set('successNotification', true);
        }
      });
    } else {
      Session.set('notificationMessage', 'Please fill in all the fields');
      Session.set('successNotification', false);
      Session.set('errorNotification', true);
    }
    return false;
  }
});
