import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './image-panel.html';

Template.imagePanel.rendered = function() {
  $('#image-tags').tagsInput({
    'defaultText':'Type here to add a tag'
  });
  // Fade in image once loaded
  loadDetailImage = function(obj) {
    $('#preview-loader').hide();
    $(obj).fadeIn('slow');
  }
}

Template.imagePanel.helpers({
  image: function () {
    return Session.get('selectedImage');
  },
  tags: function () {
    var image = Session.get('selectedImage');
    var tags = image.tags.toString();
    $('#image-tags').importTags(tags);
    return tags;
  },
  moderateQueue: function () {
    var image = Session.get('selectedImage');
    if (image) {
      var status = image.moderation[0].status;
      if(status == "pending") {
        return true;
      } else {
        return false;
      }
    }
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
    $('.imagePanel').hide();
    $('.main-panel, #library-panel-nav').fadeIn();
  },
  'click .edit-tag-link': function (e){
    e.preventDefault();
    $('.tags-group').hide();
    $('.edit-tags-group').fadeIn();
  },
  'click': function (e){
    e.preventDefault();
    $('#share-image-modal').fadeOut();
  },
  'click .share-image-link, #share-image-modal': function (e){
    e.preventDefault();
    $('#share-image-modal').fadeIn();
  },
  'click .moderate-approve': function (e){
    e.preventDefault();
    var status = "approved";
    var id = Session.get('selectedImage').public_id;
    Meteor.call("updateStatus", id, status, function(error, r) {
      if (!error) {
        Session.set('selectedImage', r);
      } else {
        console.log(error);
      }
    });
  },
  'click .moderate-reject': function (e){
    e.preventDefault();
    var status = "reject";
    var id = Session.get('selectedImage').public_id;
    Meteor.call("updateStatus", id, status, function(error, r) {
      if (!error) {
        Session.set('selectedImage', r);
      } else {
        console.log(error);
      }
    });
  },
  'click .delete-image': function (e){
    e.preventDefault();
    if (confirm("Are you sure you want to delete this image?")) {
      var id = Session.get('selectedImage').public_id;
      $('.imagePanel').fadeOut();
      Meteor.call("deleteImage", id, function(error, r) {
        if (!error) {
          Session.set('selectedImage', undefined);
          // If a tag filter was applied, fetch the latest
          var tag = Session.get('selectedTag');
          if (tag) {
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
            // If tag filter is not applied, return all images
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
    Meteor.call("updateImageTags", id, tags, function(error, r) {
      if (!error) {
        Session.set('selectedImage', r);
      } else {
        console.log(error);
      }
    });
  },
  "click .image-tags li": function(e) {
    // On click, performs a tag search of the selected tag
    var tag = $(e.target).text();
    Session.set('photoStream', undefined);
    Session.set('showNoResults', false);
    Session.set('selectedTag', tag);
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
    $('.imagePanel').hide();
    $('.main-panel, #library-panel-nav').fadeIn();
    // Remove search value if clicked on filter
    $('input.tag-search').val(tag);
    e.preventDefault();
    e.stopPropagation();
  }
});
