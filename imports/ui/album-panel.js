import { Template } from 'meteor/templating';
import { Albums } from '../api/albums/albums.js';
import { ReactiveVar } from 'meteor/reactive-var';

import './album-panel.html';

Template.albumPanel.onCreated( () => {
  Template.instance().subscribe( 'albums' );
});

Template.albumPanel.helpers({
  albums: function () {
    var albums = Albums.find().fetch();
    return albums;
  }
});

Template.albumPanel.events({
  'click .add-album': function(event){
      event.preventDefault();
      $('.add-album-modal').fadeIn();
  },
  'click .cancel-new-album': function(event){
      event.preventDefault();
      $('.add-album-modal').fadeOut();
  },
  'submit .new-album-form': function(e, t) {
    e.preventDefault();
    var owner = Meteor.userId();
    var name = $('#album-name').val();
    var collaborators = $('#album-collaborators').val();
    Meteor.call('createAlbum', owner, name, collaborators, function(err, response) {
			if (response) {
        $('.add-album-modal').fadeOut();
      }
		});
    return false;
  }
});
