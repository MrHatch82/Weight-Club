export default function ({ store, route, redirect }) {
  if (
    !localStorage.getItem('sessionToken') &&
    store.state.loggedInUserId === null &&
    route.path !== '/'
  ) {
    return redirect('/');
  }
}
