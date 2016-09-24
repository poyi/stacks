import { Template } from 'meteor/templating';
import { Albums } from '../api/albums/albums.js';
import { ReactiveVar } from 'meteor/reactive-var';

import './album.html';

Template.album.rendered = function() {
  $('#settings-panel').hide();
  // Fade in images when fully loaded
  init = function(obj) {
    $(obj).fadeIn('slow');
  }
}

Template.album.onCreated(function() {
  Template.instance().subscribe( 'albums' );
  var albumId = FlowRouter.getParam("albumId");
  if (albumId) {
    Session.set('albumID', albumId);
  }
});

Template.album.helpers({
  accountName: function() {
    var firstName = Meteor.user().profile.firstName;
    if (firstName) {
      return firstName;
    } else {
      var sample = "Traveler";
      return sample;
    }
  },
  noAlbumPhoto: function () {
    return Session.get('noAlbumPhoto');
  },
  albumPhotos: function () {
    var albumId = Session.get("albumID");
    var album = Albums.findOne({_id: albumId});
    if(album) {
      return album.photos;
    } else {
      Session.set('noAlbumPhoto', true);
    }
  },
  name: function() {
    var albumId = Session.get("albumID");
    var album = Albums.findOne({_id: albumId});
    if(album) {
      return album.name;
    }
  }
});

// #TODO: Find a way to dry this settings link, used on libary and album page
Template.album.events({
  'click .settings': function(event){
        event.preventDefault();
        $('.settings').hide();
        $('.close-settings').fadeIn();
        $('.main-panel, #library-panel-nav').hide();
        $('.library-panel').hide();
        $('.tab-menu li').removeClass( "active-nav" );
        $('#settings-panel').fadeIn();
        $('.notification-banner').hide();
  },
  'submit #album-name-form': function(event){
        event.preventDefault();
        var albumId = Session.get("albumID");
        var newName = $('#edit-album-name').val();
        Meteor.call("updateAlbumName", albumId, newName, function(error, r) {
          if (!error) {
            console.log('Album name updated to: ' + newName);
          } else {
            console.log(error);
          }
        });
  },
  'click .close-settings': function(event){
        event.preventDefault();
        $('.close-settings').hide();
        $('#settings-panel').hide();
        $('.settings').fadeIn();
        $('.library-panel').hide();
        $('.tab-menu li').removeClass( "active-nav" );
        $('.main-panel, #library-panel-nav').fadeIn();
        $('.notification-banner').hide();
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
        if (r.tags) {
          var tags = r.tags.toString();
          $('#image-tags').importTags(tags);
        }
      } else {
        console.log(error);
      }
    });
  }
});
