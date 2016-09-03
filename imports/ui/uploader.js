import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './uploader.html';

Template.uploader.events({
  "change #userimage": function(e) {
    console.log('Upload triggered');
    var files;
    var files = e.currentTarget.files;
    // Upload the image to Cloudinary
    Cloudinary.upload(files, {}, function(error, r) {
      function uploadProcess(error, r) {
        if (r) {
          // Set the selectedImage to the uploaded image Id and show the image detail panel
          Session.set('selectedImage', r);
          $('.imagePanel').css("display","flex").fadeIn();
          return console.log("Upload image: " , r);
        } else {
          return console.log("Upload Error: " , error);
        }
      }
      return uploadProcess(error, r);
    });
  }
});
