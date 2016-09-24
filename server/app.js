import { Meteor } from 'meteor/meteor';
import { Albums } from '../imports/api/albums/albums.js';

cloudinary.config({
 cloud_name: Meteor.settings.public.CLOUDINARY_CLOUD_NAME,
 api_key: Meteor.settings.public.CLOUDINARY_API_KEY,
 api_secret: Meteor.settings.CLOUDINARY_API_SECRET
});

Meteor.startup(() => {

  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };

  Accounts.onCreateUser(function(options, user) {
    // We're enforcing at least an empty profile object to avoid needing to check
    // for its existence later.
    user.profile = options.profile ? options.profile : {};
    return user;
  });

  Meteor.methods({
    getAllImages: function (options) {
      this.unblock();
      var results = cloudinary.api.resources(function(result) { console.log(result) }, { max_results: '500', moderations: true});
      return results;
    },
    getImagebyTag: function (tag) {
      var results = cloudinary.api.resources_by_tag(tag, function(result) { console.log(result) }, { max_results: '500'});
      return results;
    },
    updateStatus: function (id, status) {
      var results = cloudinary.api.update(id, function(result) { console.log(result) }, { moderation_status: status });
      return results;
    },
    getImage: function (id) {
      var results = cloudinary.api.resource(id, function(result) { console.log(result) });
      return results;
    },
    getModerateQueue: function (id) {
      var results = cloudinary.api.resources_by_moderation('manual', 'pending', function(result) { console.log(result) });
      return results;
    },
    updateImageTags: function (id, tags) {
      var results = cloudinary.api.update(id, function(result) { console.log(result) }, { tags: tags });
      return results;
    },
    deleteImage: function (id) {
      var results = cloudinary.api.delete_resources(id, function(result) { console.log(result) }, { invalidate: true});
      return results;
    },
    updateUser: function (userId, firstName, lastName) {
      Meteor.users.update({_id:userId}, { $set:{"profile.firstName":firstName, "profile.lastName":lastName}} );
      return true;
    },
    createAlbum: function (owner, name, collaborators) {
      Albums.insert({owner: owner, name: name, collaborators: collaborators, photos: []});
      return true;
    },
    updateAlbumName: function (albumId, newName) {
      Albums.update({_id:albumId}, { $set:{"name":newName}});
      return true;
    },
    findAlbum: function (albumId) {
      return Albums.findOne({_id: albumId});
    },
    addToAlbum: function (albumId, imageId, file_format) {
      var album = Meteor.call("findAlbum", albumId);
      var photosArray = album.photos;
      var image = {
        "image_id": imageId,
        "file_format": file_format
      };
      var imageInAlbum = Meteor.call('checkImageWithinArray', image, photosArray);
      if (imageInAlbum) {
        console.log('Image is already in the album');
      } else {
        Albums.update({_id:albumId},{$push: { photos: image } });
        console.log('Image added to album!');
        return true;
      }
    },
    removeFromAlbum: function (albumId, imageId, file_format) {
      var photo = {
        "image_id": imageId,
        "file_format": file_format
      };
      Albums.update({_id:albumId},{$pull: { photos: photo } });
      return true;
    },
    checkImageWithinArray: function (image, photosArray) {
      var imageItem = JSON.stringify(image);
      var i;
      if(photosArray) {
        for (i = 0; i < photosArray.length; i++) {
          var arrayItem = JSON.stringify(photosArray[i]);
            if (arrayItem == imageItem) {
                return true;
            }
        }
      } else {
        return false
      }
    }
  });
});
