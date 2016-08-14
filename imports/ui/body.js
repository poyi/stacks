import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './body.html';

// Template.body.helpers({
//   photos() {
//     var url = $.cloudinary.url('water', {format: 'json', type: 'list'});
//     console.log(url);
//     var result = Meteor.http.call("GET", url,
//           {data: {some: "json", stuff: 1}},
//           function (error, result) {
//             if (!error) {
//               Session.set("twizzled", true);
//             }
//           });
//     console.log(result);
//     return url;
//   },
//   selectedImage: function() {
//     return Session.get('selectedImagePublicId');
//   }
// });

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
  var self = this;
  self.resources = new ReactiveVar(null);
  Meteor.call("getAllImages", function(error, r) {
    console.log("Rendering data: ");
    console.log(r);
    if (!error) {
      self.resources.set(r.resources);
    } else {
       console.log(error);
    }
  });
});

Template.body.helpers({
  photoStream: function () {
    var self = Template.instance();
    return self.resources.get();
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
    console.log("input submitted");
    e.preventDefault();
    e.stopPropagation();
    return false;
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
