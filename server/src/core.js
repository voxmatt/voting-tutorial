import { List, Map } from 'immutable';

function getWinners(votes) {
  if (!votes) return [];
  const [a, b] = votes.get('pair');
  const aVotes = votes.getIn(['tally', a], 0);
  const bVotes = votes.getIn(['tally', b], 0);

  if (aVotes > bVotes) return [a]; // a wins
  else if (bVotes > aVotes) return [b]; // b wins
  return [a, b]; // tie
}

export const INITIAL_STATE = new Map();

export function setEntries(state, entries) {
  return state.set('entries', new List(entries));
}

export function next(state) {
  const entries = state.get('entries').concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state.remove('vote')
      .remove('entries')
      .set('winner', entries.first());
  }
  return state.merge({
    vote: new Map({
      pair: entries.take(2),
    }),
    entries: entries.skip(2),
  });
}

export function vote(state, entry) {
  return state.updateIn(['tally', entry], 0, tally => tally + 1);
}
