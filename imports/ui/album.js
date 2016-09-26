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
    } else {
      Session.set('noAlbumPhoto', true);
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
  'click .delete-album': function(event){
        event.preventDefault();
        var albumId = Session.get("albumId");
        if (confirm("Are you sure you want to delete this album? (The images will remain in your library)")) {
          Meteor.call("deleteAlbum", albumId, function(error, r) {
            if (!error) {
              FlowRouter.go('/my-albums');
            } else {
              console.log(error);
            }
          });
        }
        return false;
  },
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
  }
});
