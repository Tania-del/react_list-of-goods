import React, { RefObject } from 'react';
import 'bulma/css/bulma.css';
import './App.scss';

export const goodsFromServer = [
  'Dumplings',
  'Carrot',
  'Eggs',
  'Ice cream',
  'Apple',
  'Bread',
  'Fish',
  'Honey',
  'Jam',
  'Garlic',
];

enum SortType {
  NONE,
  ALPHABET,
  LENGTH,
}

type ReorderOptions = {
  sortType: SortType;
  isReversed: boolean;
};

// Use this function in the render method to prepare goods
export function getReorderedGoods(
  goods: string[],
  { sortType, isReversed }: ReorderOptions,
) {
  // To avoid the original array mutation
  const visibleGoods = [...goods];

  if (sortType === SortType.ALPHABET || sortType === SortType.LENGTH) {
    visibleGoods.sort((a, b) => {
      switch (sortType) {
        case SortType.ALPHABET:
          return a.localeCompare(b);
        default:
          return a.length - b.length;
      }
    });
  }
  // eslint-disable-next-line no-console

  if (isReversed) {
    visibleGoods.reverse();
  }

  return visibleGoods;
}

// DON'T save goods to the state
type State = {
  isReversed: boolean;
  sortType: SortType;
};

const defaultValue = {
  isReversed: false,
  sortType: SortType.NONE,
};

type Props = {};

export class App extends React.Component<Props, State> {
  private buttonSortAlpRef: RefObject<HTMLButtonElement>;

  private buttonSortLengRef: RefObject<HTMLButtonElement>;

  private buttonReverseRef: RefObject<HTMLButtonElement>;

  constructor(props: Props) {
    super(props);
    this.buttonSortAlpRef = React.createRef<HTMLButtonElement>();
    this.buttonSortLengRef = React.createRef<HTMLButtonElement>();
    this.buttonReverseRef = React.createRef<HTMLButtonElement>();
  }

  state: Readonly<State> = defaultValue;

  componentDidUpdate() {
    const { sortType, isReversed } = this.state;
    const { buttonSortAlpRef, buttonSortLengRef, buttonReverseRef } = this;

    if (sortType === SortType.ALPHABET) {
      buttonSortAlpRef.current?.classList.remove('is-light');
    } else {
      buttonSortAlpRef.current?.classList.add('is-light');
    }

    if (sortType === SortType.LENGTH) {
      buttonSortLengRef.current?.classList.remove('is-light');
    } else {
      buttonSortLengRef.current?.classList.add('is-light');
    }

    if (isReversed) {
      buttonReverseRef.current?.classList.remove('is-light');
    } else {
      buttonReverseRef.current?.classList.add('is-light');
    }
  }

  setAlphabet = () => {
    this.setState((prev) => ({
      ...prev,
      sortType:
        prev.sortType === SortType.ALPHABET ? SortType.NONE : SortType.ALPHABET,
    }));
  };

  setLength = () => {
    this.setState((prev) => ({
      ...prev,
      sortType:
        prev.sortType === SortType.LENGTH ? SortType.NONE : SortType.LENGTH,
    }));
  };

  handleReversed = () => {
    this.setState((prev) => ({
      ...prev,
      isReversed: !prev.isReversed,
    }));
  };

  handleReset = () => {
    this.setState(defaultValue);
  };

  render() {
    const { sortType, isReversed } = this.state;
    const {
      buttonSortAlpRef, buttonSortLengRef, buttonReverseRef,
      setAlphabet, setLength, handleReversed, handleReset,
    } = this;

    return (
      <div className="section content">
        <div className="buttons">
          <button
            ref={buttonSortAlpRef}
            onClick={setAlphabet}
            type="button"
            className="button is-info is-light"
          >
            Sort alphabetically
          </button>

          <button
            ref={buttonSortLengRef}
            onClick={setLength}
            type="button"
            className="button is-success is-light"
          >
            Sort by length
          </button>

          <button
            ref={buttonReverseRef}
            onClick={handleReversed}
            type="button"
            className="button is-warning is-light"
          >
            Reverse
          </button>

          {(defaultValue.isReversed === isReversed
          && defaultValue.sortType === sortType) || (
            <button
              onClick={handleReset}
              type="button"
              className="button is-danger is-light"
            >
              Reset
            </button>
          )}
        </div>

        <ul>
          {getReorderedGoods(goodsFromServer, { sortType, isReversed }).map(
            (good) => (
              <li key={good} data-cy="Good">
                {good}
              </li>
            ),
          )}
        </ul>
      </div>
    );
  }
}
