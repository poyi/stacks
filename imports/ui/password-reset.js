import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './password-reset.html';

Template.passwordReset.onCreated(function() {
  var token = FlowRouter.getParam("token");
  if (token) {
    console.log('reset token is' + token);
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
            console.log('This email does not exist.');
          } else {
            console.log('We are sorry but something went wrong.');
          }
        } else {
          console.log('Email Sent. Check your mailbox.');
        }
      });

    }
    return false;
  },
});

Template.passwordReset.helpers({
 resetPassword: function(){
  return Session.get('resetPassword');
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
          console.log(err);
          console.log('We are sorry but something went wrong.');
        } else {
          console.log('Your password has been changed. Welcome back!');
          Session.set('resetPassword', null);
          FlowRouter.go('/library');
        }
      });
    }
    return false;
  }
});
