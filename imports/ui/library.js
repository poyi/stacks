import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './library.html';
import './image-panel.html';
import './uploader.html';
import './settings.html';

Template.library.onCreated(function() {
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
  $('#settings-panel').hide();
  // Fade in image once loaded
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

Template.library.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout(function (success, error) {
            FlowRouter.go('/');
        });
  },
  'click #browse-tags': function(event){
        event.preventDefault();
        $('.main-panel').hide();
        $('.imagePanel').hide();
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
  'click .settings': function(event){
        event.preventDefault();
        $('.settings').hide();
        $('.close-settings').fadeIn();
        $('.main-panel, #library-panel-nav').hide();
        $('.imagePanel').hide();
        $('.tag-panel').hide();
        $('.tab-menu li').removeClass( "active-nav" );
        $('#settings-panel').fadeIn();
        $('.notification-banner').hide();
  },
  'click .close-settings': function(event){
        event.preventDefault();
        $('.close-settings').hide();
        $('#settings-panel').hide();
        $('.settings').fadeIn();
        $('.imagePanel').hide();
        $('.tag-panel').hide();
        $('.tab-menu li').removeClass( "active-nav" );
        $('.main-panel, #library-panel-nav').fadeIn();
        $('.notification-banner').hide();
  },
  'click #moderate-image': function(event){
        event.preventDefault();
        $('.tag-panel').hide();
        $('.main-panel, #library-panel-nav').fadeIn();
        $('.tab-menu li').removeClass( "active-nav" );
        $('#moderate-image').addClass( "active-nav" );
        Session.set('photoStream', '');
        Meteor.call("getModerateQueue", function(error, r) {
          if (!error) {
            // Check if returned result is none, if so set showNoResults to be true
            var returnedArray = r.resources.length;
            if (returnedArray == 0) {
              console.log('moderate empty');
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
    $('.tag-panel').hide();
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
  "click .image-thumb": function(e) {
    Session.set('selectedImage', false);
    var selectedImage = $(e.target).attr("data-id");
    Meteor.call("getImage", selectedImage, function(error, r) {
      if (!error) {
        // Check if returned result is none, if so set showNoResults to be true
        Session.set('selectedImage', r);
        $('.main-panel, #library-panel-nav').hide();
        $('.imagePanel').fadeIn();
        // Set the tag input for image edit
        var tags = r.tags.toString();
        $('#image-tags').importTags(tags);
      } else {
        console.log(error);
      }
    });
  }
});
