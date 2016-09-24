import { Mongo } from 'meteor/mongo';

export const Albums = new Mongo.Collection('Albums');

Albums.schema = new SimpleSchema({
  name: {type: String, optional: true},
  owner: {type: String, optional: true},
  collaborators: {type: Object, blackbox: true, optional: true}
});
