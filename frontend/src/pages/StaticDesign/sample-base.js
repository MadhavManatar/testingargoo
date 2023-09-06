import * as React from 'react';

export class SampleBase extends React.PureComponent {
  // eslint-disable-next-line react/sort-comp
  rendereComplete() {
    /** custom render complete function */
  }

  componentDidMount() {
    setTimeout(() => {
      this.rendereComplete();
    });
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function updateSampleSection() {}
