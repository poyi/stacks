import { Template } from 'meteor/templating';
import { Albums } from '../api/albums/albums.js';
import { ReactiveVar } from 'meteor/reactive-var';

import './album.html';

Template.album.onCreated(function() {
  Template.instance().subscribe( 'albums' );
  var albumId = FlowRouter.getParam("albumId");
  if (albumId) {
    Session.set('albumId', albumId);
  }
});

Template.album.rendered = function() {
  $('#settings-panel').hide();
  // Fade in images when fully loaded
  init = function(obj) {
    $(obj).fadeIn('slow');
  }
}

Template.album.helpers({
  noAlbumPhoto: function () {
    return Session.get('noAlbumPhoto');
  },
  albumPhotos: function () {
    var albumId = Session.get("albumId");
    var album = Albums.findOne({_id: albumId});
    if(album) {
      if (album.photos) {
        return album.photos;
      } else {
        Session.set('noAlbumPhoto', true);
      }
    }
  },
  name: function() {
    var albumId = Session.get("albumId");
    var album = Albums.findOne({_id: albumId});
    if(album) {
      return album.name;
    }
  },
  albumId: function() {
    return Session.get('albumId');
  }
});

Template.album.events({
  'submit #album-name-form': function(event){
        event.preventDefault();
        var albumId = Session.get("albumId");
        var newName = $('#edit-album-name').val();
        Meteor.call("updateAlbumName", albumId, newName, function(error, r) {
          if (!error) {
            console.log('Album name updated to: ' + newName);
          } else {
            console.log(error);
          }
        });
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
