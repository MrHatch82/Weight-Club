export default function ({ store, route, redirect }) {
  if (store.state.loggedInUserId === null && route.path !== '/') {
    return redirect('/');
  }
}
