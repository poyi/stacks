var PublicPage = FlowRouter.group();

FlowRouter.route( '/login', {
  triggersEnter: [
    function(context,redirect) {
      if (Meteor.userId()) {
        redirect('/library');
      }
  }],
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'login'});
  }
});

FlowRouter.route( '/register', {
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'register'});
  }
});

FlowRouter.route( '/library', {
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {redirect('/login');}
    }],
  triggersExit: [ function() {
    if (!Meteor.userId()) {FlowRouter.go('/login');} else {
      FlowRouter.go('/library');
      Session.set('lastRoute', '/library');
    }
  }],
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'library'});
  }
});

FlowRouter.route( '/settings', {
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'settings'});
  }
});

FlowRouter.route( '/', {
  triggersEnter: [
    function(context,redirect) {
      if (Meteor.userId()) {redirect('/library');}
  }],
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'home'});
  }
});

FlowRouter.route( '/logout', {
  triggersEnter: [
    function(context,redirect) {
      redirect('/login');
  }],
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'login'});
  }
});

FlowRouter.route('/moderate-queue', {
  triggersExit: [ function() {
    Session.set('lastRoute', '/moderate-queue');
  }],
    action: function(params) {
        BlazeLayout.render('applicationLayout', {main: 'moderatePanel'});
    }
});
FlowRouter.route('/albums/:albumId', {
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {redirect('/login');}
    }
  ],
  triggersExit: [ function() {
    var lastRoute = FlowRouter.current().path;
    Session.set('lastRoute', lastRoute);
  }],
    action: function(params) {
        BlazeLayout.render('applicationLayout', {main: 'album'});
    }
});

FlowRouter.route('/images/:imageId', {
  triggersExit: [ function() {
    var lastRoute = FlowRouter.current().path;
    Session.set('lastRoute', lastRoute);
  }],
    action: function(params) {
        BlazeLayout.render('applicationLayout', {main: 'imagePanel'});
    }
});

FlowRouter.route('/:albumId/images/:imageId', {
  triggersExit: [ function() {
    var lastRoute = FlowRouter.current().path;
    Session.set('lastRoute', lastRoute);
  }],
    action: function(params) {
        BlazeLayout.render('applicationLayout', {main: 'imagePanel'});
    }
});

FlowRouter.route('/my-albums', {
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {redirect('/login');}
    }
  ],
  triggersExit: [ function() {
    var lastRoute = FlowRouter.current().path;
    Session.set('lastRoute', lastRoute);
  }],
    action: function(params) {
        BlazeLayout.render('applicationLayout', {main: 'albumPanel'});
    }
});

FlowRouter.route( '/password-recovery', {
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'passwordReset'});
  }
});

FlowRouter.route( '/reset-password/:token', {
  action: function(params) {
    BlazeLayout.render('applicationLayout', {main: 'passwordReset'});
  }
});

FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render('applicationLayout', {main: '404'});
    }
};
