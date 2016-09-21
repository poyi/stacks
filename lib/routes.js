var PublicPage = FlowRouter.group();

FlowRouter.route( '/login', {
  triggersEnter: [
    function() {
      if (Meteor.userId()) {FlowRouter.go('/library');}
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
    function() {
      if (!Meteor.userId()) {FlowRouter.go('/login');}
    }],
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'library'});
  }
});

FlowRouter.route( '/', {
  action: function() {
    BlazeLayout.render('applicationLayout', {main: 'home'});
  }
});

FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render('applicationLayout', {main: '404'});
    }
};
