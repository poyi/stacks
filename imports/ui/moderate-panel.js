import { Template } from 'meteor/templating';
import { Albums } from '../api/albums/albums.js';
import { ReactiveVar } from 'meteor/reactive-var';

import './moderate-panel.html';

Template.moderatePanel.onCreated(function() {
  // Clear within album state for the image panel nav
  Session.set('albumId', false);
  Meteor.call("getModerateQueue", function(error, r) {
    if (!error) {
      // Check if returned result is none, if so set showNoResults to be true
      var returnedArray = r.resources.length;
      console.log(r);
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

Template.moderatePanel.rendered = function() {
  // Fade in images when fully loaded
  init = function(obj) {
    $(obj).fadeIn('slow');
  }
}

Template.moderatePanel.helpers({
  photoStream: function () {
    return Session.get('photoStream');
  },
  noResults: function () {
    return Session.get('showNoResults');
  }
});
