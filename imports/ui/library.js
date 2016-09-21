import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './library.html';
import './image-panel.html';
import './uploader.html';

Template.library.onCreated(function() {
  Meteor.call("getAllImages", function(error, r) {
    console.log("Rendering data: ");
    console.log(r);
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
  }
});

Template.library.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        FlowRouter.go('/login');
  },
  "submit form": function(e) {
    // On submit, make new call to retrieve content based on the entered tag
    var tag = $( ".tag-search" ).val();
    Session.set('selectedTag', tag);
    Session.set('photoStream', undefined);
    Session.set('showNoResults', false);
    Meteor.call("getImagebyTag", tag, function(error, r) {
      console.log("Rendering images by tag: ");
      console.log(r);
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
    console.log("input submitted");
    e.preventDefault();
    e.stopPropagation();
  },
  "click .image-thumb": function(e) {
    Session.set('selectedImage', false);
    var selectedImage = $(e.target).attr("data-id");
    Meteor.call("getImage", selectedImage, function(error, r) {
      console.log("Retrived image by id: ");
      console.log(r);
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
  },
  "click .category-tags li": function(e) {
    // On click, performs a tag search of the selected tag
    var tag = $(e.target).text();
    Session.set('photoStream', undefined);
    Session.set('showNoResults', false);
    Session.set('selectedTag', tag);
    Meteor.call("getImagebyTag", tag, function(error, r) {
      console.log("Rendering images by tag: ");
      console.log(r);
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
    console.log(tag);
    // Remove search value if clicked on filter
    $('input.tag-search').val('');
    e.preventDefault();
    e.stopPropagation();
  }
});
