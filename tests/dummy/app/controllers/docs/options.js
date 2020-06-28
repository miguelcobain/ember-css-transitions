import Controller from '@ember/controller';
import { action } from '@ember/object';

// BEGIN-SNIPPET actions.js
export default class ActionsController extends Controller {

  @action
  didTransitionIn() {
    alert('transitioned in');
  }

  @action
  didTransitionOut() {
    alert('transitioned out');
  }
}
// END-SNIPPET
