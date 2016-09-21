import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './register.html';


Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        }, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Signed up!");
            FlowRouter.go('/library');
          }
        });
    },
});
