import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './image-panel.html';

Template.imagePanel.rendered = function() {
  $('#image-tags').tagsInput({
    'defaultText':'Type here to add a tag'
  });
}

Template.imagePanel.helpers({
  image: function () {
    return Session.get('selectedImage');
  },
  tags: function () {
    var image = Session.get('selectedImage');
    var tags = image.tags.toString();
    $('#image-tags').importTags(tags);
    console.log(tags);
    return tags;
  },
  filesize: function () {
    var image = Session.get('selectedImage');
    if(image) {
      var number = image.bytes / 1000000;
      return Math.round(number * 100) / 100;
    } else {
      return 0;
    }
  }
});

Template.imagePanel.events({
  'click .back-link': function (e){
    e.preventDefault();
    $('.imagePanel').fadeOut();
  },
  'click .edit-tag-link': function (e){
    e.preventDefault();
    $('.tags-group').hide();
    $('.edit-tags-group').fadeIn();
  },
  'click .delete-image': function (e){
    e.preventDefault();
    if (confirm("Are you sure you want to delete this image?")) {
      var id = Session.get('selectedImage').public_id;
      $('.imagePanel').fadeOut();
      Meteor.call("deleteImage", id, function(error, r) {
        console.log("Image Deleted: ");
        console.log(r);
        if (!error) {
          Session.set('selectedImage', undefined);
          // If a tag filter was applied, fetch the latest
          var tag = Session.get('selectedTag');
          if (tag) {
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
          } else {
            // If tag filter is not applied, return all images
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
          }
        } else {
          console.log(error);
        }
      });
    }
    return false;
  },
  'click .update-tags-link': function (e){
    e.preventDefault();
    $('.tags-group').fadeIn();
    var id = Session.get('selectedImage').public_id;
    var tags = $( "#image-tags_tagsinput .tag span:first-child" ).map(function() {
      var test = $(this);
      return $(this).text().trim();
    }).get().join();
    $('.edit-tags-group').hide();
    console.log(tags);
    Meteor.call("updateImageTags", id, tags, function(error, r) {
      console.log("Tag succeffully updated: ");
      console.log(r);
      if (!error) {
        Session.set('selectedImage', r);
      } else {
        console.log(error);
      }
    });
  },
});
