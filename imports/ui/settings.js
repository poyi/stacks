import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './settings.html';

Template.settings.rendered = function() {
  Session.set('preferencePanelVisible', true);
}

Template.settings.helpers({
  bannerMessage: function(){
    return Session.get('bannerMessage');
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
  'click .back-link': function (e){
    e.preventDefault();
    $('#settings-panel').hide();
    $('.close-settings').hide();
    $('.settings').fadeIn();
    $('.tag-panel').hide();
    $('.main-panel, #library-panel-nav').fadeIn();
    $('.notification-banner').hide();
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
        console.log('user updated')
      } else {
        console.log(error);
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
          Session.set('bannerMessage', 'Something went wrong, please double check your entry');
          console.log('Please double check your old password');
          $('.notification-banner').fadeIn();
        } else {
          console.log('Your password has been changed.');
        }
      });
    } else {
      Session.set('bannerMessage', 'Please fill in all the fields');
      $('.notification-banner').fadeIn();
    }
    return false;
  }
});
