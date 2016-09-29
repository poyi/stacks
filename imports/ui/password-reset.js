import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './password-reset.html';

Template.passwordReset.onCreated(function() {
  var token = FlowRouter.getParam("token");
  if (token) {
    Session.set('resetPassword', token);
  }
});

Template.passwordReset.events({
  'submit #forgotPasswordForm': function(e, t) {
    e.preventDefault();

    var forgotPasswordForm = $(e.currentTarget),
        email = $.trim(forgotPasswordForm.find('#forgotPasswordEmail').val().toLowerCase());

    if ( email !== null && email !== '') {

      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            Session.set('notificationMessage', 'This email does not exist.');
            Session.set('successNotification', false);
            Session.set('errorNotification', true);
          } else {
            Session.set('notificationMessage', 'We are sorry but something went wrong. Please notify the Stacks administrator');
            Session.set('successNotification', false);
            Session.set('errorNotification', true);
          }
        } else {
          Session.set('notificationMessage', 'Email Sent! Check your mailbox.');
          Session.set('successNotification', true);
        }
      });

    }
    return false;
  },
});

Template.passwordReset.helpers({
  resetPassword: function(){
    return Session.get('resetPassword');
  },
  bannerMessage: function(){
    return Session.get('bannerMessage');
  }
});

Template.passwordReset.events({
  'submit #resetPasswordForm': function(e, t) {
    e.preventDefault();

    var resetPasswordForm = $(e.currentTarget),
        password = resetPasswordForm.find('#resetPasswordPassword').val(),
        passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();

    if (password !== '' && password == passwordConfirm) {
      Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
        if (err) {
          Session.set('notificationMessage', 'Something went wrong, please double check your entry');
          Session.set('successNotification', false);
          Session.set('errorNotification', true);
        } else {
          Session.set('notificationMessage', 'Your password has been changed. Welcome back!');
          Session.set('successNotification', true);
          Session.set('resetPassword', null);
          FlowRouter.go('/library');
        }
      });
    }
    return false;
  }
});
