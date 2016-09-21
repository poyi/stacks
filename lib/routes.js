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
  triggersEnter: [
    function() {
      if (Meteor.userId()) {FlowRouter.go('/library');}
  }],
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
    }
  }],
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'library'});
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

FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render('applicationLayout', {main: '404'});
    }
};
