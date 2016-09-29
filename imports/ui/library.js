import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './library.html';
import './uploader.html';

Template.library.onCreated(function() {
  // Clear within album state for the image panel nav
  Session.set('albumId', false);
  Meteor.call("getAllImages", function(error, r) {
    if (!error) {
      // Check if returned result is none, if so set showNoResults to be true
      var returnedArray = r.resources.length;
      if (returnedArray == 0) {
        Session.set('showNoResults', true);
      } else {
        Session.set('showNoResults', false);
        Session.set('photoStream', r.resources);
      }
    } else {
      Session.set('showNoResults', true);
      console.log(error);
    }
  });
});

Template.library.rendered = function() {
  Session.set('successNotification', false);
  Session.set('errorNotification', false);
  // Fade in images when fully loaded
  init = function(obj) {
    $(obj).fadeIn('slow');
  }
}

Template.library.helpers({
  photoStream: function () {
    return Session.get('photoStream');
  },
  noResults: function () {
    return Session.get('showNoResults');
  },
  moderateQueue: function () {
    Meteor.call("getModerateQueue", function(error, r) {
      if (!error) {
        // Check if returned result is none, if so hide the moderate link
        var returnedArray = r.resources.length;
        if (returnedArray == 0) {
          return false;
        } else {
          return true;
        }
      } else {
        console.log(error);
      }
    });
  }
});

Template.library.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout(function (success, error) {
            FlowRouter.go('/');
        });
  },
  'click #browse-tags': function(event){
        event.preventDefault();
        $('.library-panel').hide();
        $('.tag-panel').fadeIn();
        $('.tab-menu li').removeClass( "active-nav" );
        $('#browse-tags').addClass( "active-nav" );
  },
  'click .reset-results': function(event){
        event.preventDefault();
        $('.imagePanel').hide();
        $('.tag-panel').hide();
        $('.tab-menu li').removeClass( "active-nav" );
        Meteor.call("getAllImages", function(error, r) {
          if (!error) {
            // Check if returned result is none, if so set showNoResults to be true
            var returnedArray = r.resources.length;
            if (returnedArray == 0) {
              Session.set('showNoResults', true);
            } else {
              Session.set('showNoResults', false);
              Session.set('photoStream', r.resources);
            }
          } else {
            Session.set('showNoResults', true);
            console.log(error);
          }
        });
  },
  'click #moderate-image': function(event){
        event.preventDefault();
        $('.library-panel').hide();
        $('.main-panel, #library-panel-nav').fadeIn();
        $('.tab-menu li').removeClass( "active-nav" );
        $('#moderate-image').addClass( "active-nav" );
        Session.set('photoStream', '');
        Meteor.call("getModerateQueue", function(error, r) {
          if (!error) {
            // Check if returned result is none, if so set showNoResults to be true
            var returnedArray = r.resources.length;
            if (returnedArray == 0) {
              Session.set('showNoResults', true);
            } else {
              Session.set('showNoResults', false);
              Session.set('photoStream', r.resources);
            }
          } else {
            Session.set('showNoResults', true);
            console.log(error);
          }
        });
  },
  "submit #search-tags": function(e) {
    $('.library-panel').hide();
    $('.main-panel, #library-panel-nav').fadeIn();
    // On submit, make new call to retrieve content based on the entered tag
    var tag = $( ".tag-search" ).val();
    Session.set('selectedTag', tag);
    Session.set('photoStream', undefined);
    Session.set('showNoResults', false);
    if (tag !== '') {
      Meteor.call("getImagebyTag", tag, function(error, r) {
        if (!error) {
          // Check if returned result is none, if so set showNoResults to be true
          var returnedArray = r.resources.length;
          if (returnedArray == 0) {
            Session.set('showNoResults', true);
          } else {
            Session.set('showNoResults', false);
            Session.set('photoStream', r.resources);
          }
        } else {
          Session.set('showNoResults', true);
          console.log(error);
        }
      });
    } else {
      Meteor.call("getAllImages", function(error, r) {
        if (!error) {
          // Check if returned result is none, if so set showNoResults to be true
          var returnedArray = r.resources.length;
          if (returnedArray == 0) {
            Session.set('showNoResults', true);
          } else {
            Session.set('showNoResults', false);
            Session.set('photoStream', r.resources);
          }
        } else {
          Session.set('showNoResults', true);
          console.log(error);
        }
      });
    }
    e.preventDefault();
    e.stopPropagation();
  },
});
