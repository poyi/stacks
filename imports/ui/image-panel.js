import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Albums } from '../api/albums/albums.js';

import './image-panel.html';

Template.imagePanel.onCreated(function() {
  Session.set('selectedImage', false);
  Template.instance().subscribe( 'albums' );
  var albumId = FlowRouter.getParam("albumId");
  Session.set('albumId', albumId);
});

Template.imagePanel.rendered = function() {
  var imageId = FlowRouter.getParam("imageId");
  Meteor.call("getImage", imageId, function(error, r) {
    if (!error) {
      Session.set('selectedImage', r);
    } else {
      console.log(error);
    }
  });
  // Fade in image once loaded
  loadDetailImage = function(obj) {
    $('#preview-loader').hide();
    $(obj).fadeIn('slow');
  };
}

Template.imagePanel.helpers({
  withInAlbum: function() {
    var album = Session.get('albumId');
    return album;
  },
  image: function () {
    var image = Session.get('selectedImage');
    if (image) {
      return image;
    }
  },
  tags: function () {
    var image = Session.get('selectedImage');
    if (image.tags) {
      var tags = image.tags.toString();
      $('#image-tags').importTags(tags);
      return tags;
    }
  },
  moderateQueue: function () {
    var image = Session.get('selectedImage');
    if (image && image.moderation) {
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
  },
  albums: function () {
    var currentUser = Meteor.userId();
    var albums = Albums.find({ owner: currentUser }).fetch();
    return albums;
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
Template.imagePanel.events({
  'click .remove-from-album': function (e){
    e.preventDefault();
    var albumId = Session.get('albumId');
    var imageId = Session.get('selectedImage').public_id;
    var file_format = Session.get('selectedImage').format;
    Meteor.call("removeFromAlbum", albumId, imageId, file_format, function(error, r) {
      if (!error) {
        // #TODO: Add success message
        var currentAlbum = Session.get('albumId');
        FlowRouter.go("/albums/" + currentAlbum);
      } else {
        console.log(error);
      }
    });
  },
  'click .album-link': function (e){
    e.preventDefault();
    var albumId = $(e.target).attr('data-id');
    var imageId = Session.get('selectedImage').public_id;
    var file_format = Session.get('selectedImage').format;
    Meteor.call("addToAlbum", albumId, imageId, file_format, function(error, r) {
      if (!error) {
        Session.set('notificationMessage', 'Added image to album!');
        Session.set('successNotification', true);
      } else {
        console.log(error);
        Session.set('notificationMessage', 'Ops, something went wrong. Please try again.');
        Session.set('successNotification', false);
        Session.set('errorNotification', true);
      }
    });
    $('.add-to-album-link').show();
    $('.add-to-album, .close-album-list-link').hide();
  },
  'click .add-to-album-link': function (e){
    e.preventDefault();
    $('.add-to-album').show();
    $('.add-to-album-link').hide();
    $('.close-album-list-link').show();
  },
  'click .close-album-list-link': function (e){
    e.preventDefault();
    $('.add-to-album-link').show();
    $('.close-album-list-link').hide();
    $('.add-to-album').fadeOut();
  },
  'click .back-link': function (e){
    e.preventDefault();
    $('.imagePanel').hide();
    $('.main-panel, #library-panel-nav').fadeIn();
  },
  'click .edit-tag-link': function (e){
    e.preventDefault();
    // #TODO: There is no way to destroy tagsInput when initialized so every click duplicates the input
    $('.tags-group').hide();
    $('.edit-tags-group').fadeIn();
    $('#image-tags').tagsInput({
      'height':'100px',
      'width':'300px',
      'defaultText':'Type here to add a tag'
    });
    var image = Session.get('selectedImage');
    if (image.tags) {
      var tags = image.tags.toString();
      $('#image-tags').importTags(tags);
    }
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
        FlowRouter.go('/moderate-queue');
      } else {
        console.log(error);
      }
    });
  },
  'click .moderate-reject': function (e){
    e.preventDefault();
    var status = "rejected";
    var id = Session.get('selectedImage').public_id;
    Meteor.call("updateStatus", id, status, function(error, r) {
      if (!error) {
        FlowRouter.go('/moderate-queue');
      } else {
        console.log(error);
      }
    });
  },
  'click .delete-image': function (e){
    e.preventDefault();
    if (confirm("Are you sure you want to delete this image?")) {
      var id = Session.get('selectedImage').public_id;
      Meteor.call("deleteImage", id, function(error, r) {
        if (!error) {
          FlowRouter.go('/library');
        } else {
          console.log(error);
        }
      });
    }
    return false;
  },
  'click .update-tags-link': function (e){
    e.preventDefault();
    var id = Session.get('selectedImage').public_id;
    var tags = $( "#image-tags_tagsinput .tag span:first-child" ).map(function() {
      return $(this).text().trim();
    }).get().join();
    Meteor.call("updateImageTags", id, tags, function(error, r) {
      if (!error) {
        location.reload();
      } else {
        console.log(error);
      }
    });
  },
  "click image-tags li": function(e) {
    // #TODO: On click, performs a tag search of the selected tag back on the library
    var tag = $(e.target).text();
    Session.set('selectedTag', tag);
    e.preventDefault();
    e.stopPropagation();
  }
});
