import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './tagPanel.html';

Template.tagPanel.events({
  'click .back-link': function (e){
    e.preventDefault();
    $('.tag-panel').hide();
    $('.tab-menu li').removeClass( "active-nav" );
    $('.main-panel, #library-panel-nav').fadeIn();
  },
  "click .category-tags li": function(e) {
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
    $('.tag-panel').hide();
    $('.tab-menu li').removeClass( "active-nav" );
    $('.main-panel, #library-panel-nav').fadeIn();
    // Remove search value if clicked on filter
    $('input.tag-search').val(tag);
    e.preventDefault();
    e.stopPropagation();
  }
});
