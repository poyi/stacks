import { Albums } from '../imports/api/albums/albums.js';

Meteor.publish("albums", function () {
  return Albums.find({});
});
