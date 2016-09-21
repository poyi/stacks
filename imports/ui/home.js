import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './home.html';

Template.home.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
              // Need to display error message
              console.log(error.reason);
          } else {
              FlowRouter.go("/library");
          }
        });
    }
});
