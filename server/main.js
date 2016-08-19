import { Meteor } from 'meteor/meteor';

cloudinary.config({
 cloud_name: Meteor.settings.public.CLOUDINARY_CLOUD_NAME,
 api_key: Meteor.settings.public.CLOUDINARY_API_KEY,
 api_secret: Meteor.settings.CLOUDINARY_API_SECRET
});

Meteor.startup(() => {
  Meteor.methods({
    getAllImages: function () {
      console.log("Should being fetching json");
      this.unblock();
      var results = cloudinary.api.resources(function(result) { console.log(result) }, { max_results: '500'});
      console.log("Fetched completed!");
      return results;
    },
    getImagebyTag: function (tag) {
      console.log("tag is: " + tag);
      var results = cloudinary.api.resources_by_tag(tag, function(result) { console.log(result) }, { max_results: '500'});
      return results;
    }
  });
});
