import { Template } from 'meteor/templating';
import { Albums } from '../api/albums/albums.js';
import { ReactiveVar } from 'meteor/reactive-var';

import './albums-panel.html';

Template.albumPanel.onCreated( () => {
  Template.instance().subscribe( 'albums' );
  // Clear within album state for the image panel nav
  Session.set('albumId', false);
});

Template.albumPanel.helpers({
  albums: function () {
    var currentUser = Meteor.userId();
    var albums = Albums.find({ owner: currentUser }).fetch();
    console.log(albums);
    return albums;
  }
});

Template.albumPanel.events({
  'click .add-album': function(event){
      event.preventDefault();
      $('.add-album-modal').fadeIn();
  },
  'mouseenter .cover-1': function(event){
      event.preventDefault();
      $(event.target).siblings(".cover-0").css({"opacity": "0.5", "transform": "rotateX(20deg)", "z-index": "10", "margin-top": "25px"});
      $(event.target).siblings(".cover-2").css({"margin-top": "22px", "opacity": "1"});
      $(event.target).siblings(".cover-3").css({"margin-top": "14px", "opacity": "0.6"});
  },
  'mouseleave .cover-1': function(event){
      event.preventDefault();
      $(event.target).siblings(".cover-0").css({"opacity": "0", "transform": "", "z-index": "2", "margin-top": "20px"});
      $(event.target).siblings('.cover-2').css({"margin-top": "20px", "opacity": ""});
      $(event.target).siblings('.cover-3').css({"margin-top": "20px", "opacity": ""});
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
