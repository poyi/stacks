import { Mongo } from 'meteor/mongo';

export const Albums = new Mongo.Collection('Albums');

// #TODO: Test and bulletproof my schema
// 
// Albums.schema = new SimpleSchema({
//   name: {type: String, optional: true},
//   owner: {type: String, optional: true},
//   collaborators: {type: Object, blackbox: true, optional: true},
//   photos: {type: Object, blackbox: true, optional: true},
// });
