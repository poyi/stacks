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
      var results = cloudinary.api.resources(function(result) { console.log(result) }, { max_results: '10'});
      console.log("Fetched completed!");
      return results;
      //
      // if (result.statusCode === 200) {
      //   console.log(result.content);
      //   return result.data;
      // } else {
      //   throw new Meteor.Error('HTTP get status ' + result.statusCode);
      // }
    },
    getImagebyTag: function (tag) {
      console.log("Should being fetching json");
      var results = cloudinary.api.resources_by_tag(tag, function(result) { console.log(result) }, { max_results: '10'});
      return results;
    }
  });
});
