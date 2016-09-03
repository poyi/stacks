import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './uploader.html';


Template.uploader.rendered = function() {
  document.getElementById("upload_widget_opener").addEventListener("click", function() {

    cloudinary.openUploadWidget({ cloud_name: Meteor.settings.public.CLOUDINARY_CLOUD_NAME, upload_preset: 'stacksUpload'},
      function(error, result) {
        if(!error) {
          Session.set('selectedImage', result[0]);
          $('.imagePanel').css("display","flex").fadeIn();
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
        }
        console.log(error, result)
      });

  }, false);
}

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
