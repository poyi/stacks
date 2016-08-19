import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './body.html';

Template.insertPhotoForm.helpers({
  InsertPhotoFormVisible: function() {
    return Session.get('InsertPhotoFormVisible');
  },
  showLoadingModal: function() {
    return Session.get('showLoadingModal');
  },
  image_id: function() {
    return Session.get('currentImageId');
  },
  public_id: function() {
    return Session.get('currentImageId');
  }
});

Template.updatePhotoForm.helpers({
  public_id: function() {
    return Session.get('selectedImagePublicId');
  },
  photo: function() {
    return Session.get('selectedImageId');
  }
});

Template.body.onCreated(function() {
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
});

Template.body.rendered = function() { // Template.thirdTemplate.created - also worked.
  init = function(obj) {
    console.log('imgggg');
    $(obj).fadeIn('slow');
  //what ever i wished to do
  }
}

Template.body.helpers({
  photoStream: function () {
    return Session.get('photoStream');
  },
  noResults: function () {
    return Session.get('showNoResults');
  }
});

Template.body.events({
  "change input[type='file']": function(e) {
    var files;
    var files = e.currentTarget.files;
    // Show the photo management model upon upload
    Session.set('showLoadingModal', true);

    // Upload the image to Cloudinary
    Cloudinary.upload(files, {}, function(err, res) {
      function uploadProcess(err, res) {
        if (res) {
          Session.set('showLoadingModal', false);
          Session.set('InsertPhotoFormVisible', true);
          // Insert the returned public id into the form field
          const public_id = res.public_id;
          Session.set('currentImageId', public_id);
          return console.log("Upload Result: " , res);
        } else {
          return console.log("Upload Error: " , err);
        }
      }
      return uploadProcess(err, res);
    });
  },
  "submit form": function(e) {
    // On submit, make new call to retrieve content based on the entered tag
    var tag = $( ".tag-search" ).val();
    Session.set('photoStream', undefined);
    Session.set('showNoResults', false);
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
    console.log("input submitted");
    e.preventDefault();
    e.stopPropagation();
  },
  "click .category-tags li": function(e) {
    // On click, performs a tag search of the selected tag
    var tag = $(e.target).text();
    Session.set('photoStream', undefined);
    Session.set('showNoResults', false);
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
    console.log(tag);
    e.preventDefault();
    e.stopPropagation();
  }
});

Template.updatePhotoForm.events({
  'click .close': function (e){
    e.preventDefault();
    Session.set('selectedImagePublicId', undefined);
    Session.set('selectedImageId', undefined);
  },
  'click .remove-photo': function (e){
    e.preventDefault();
    Session.set('selectedImagePublicId', undefined);
    Session.set('selectedImageId', undefined);
  }
});

var insertPhoto = {
  onSubmit: function(doc) {
    console.log("submitting");
  },
  onSuccess: function(operation, result, template) {
      // display success, reset form status
      Session.set('InsertPhotoFormVisible', false);
      console.log("Image successfully created");
  },
  onError: function(operation, error, template) {
    // display error, reset form status
    console.log("Error: CAPTCHA Validation failed!");
  }
};

var updatePhoto = {
  onSuccess: function(operation, result, template) {
      // display success, reset form status
      Session.set('selectedImagePublicId', undefined);
      console.log("Photo Updated");
  },
  onError: function(operation, error, template) {
    // display error, reset form status
    console.log("Error: Something went wrong when updating the photo");
  }
};


AutoForm.hooks({
  insertPhotoForm: insertPhoto,
  updatePhotoForm: updatePhoto
});
