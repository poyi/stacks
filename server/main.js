import { Meteor } from 'meteor/meteor';

cloudinary.config({
 cloud_name: Meteor.settings.public.CLOUDINARY_CLOUD_NAME,
 api_key: Meteor.settings.public.CLOUDINARY_API_KEY,
 api_secret: Meteor.settings.CLOUDINARY_API_SECRET
});

Meteor.startup(() => {
  Meteor.methods({
    getAllImages: function (options) {
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
    },
    getImage: function (id) {
      var results = cloudinary.api.resource(id, function(result) { console.log(result) });
      return results;
    },
    updateImageTags: function (id, tags) {
      var results = cloudinary.api.update(id, function(result) { console.log(result) }, { tags: tags });
      return results;
    },
    deleteImage: function (id) {
      var results = cloudinary.api.delete_resources(id, function(result) { console.log(result) }, { invalidate: true});
      return results;
    }
  });
});
