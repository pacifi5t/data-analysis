import { pretty } from './helpers';

export class Series {
  length: number;
  data: number[];
  count: Map<number, number>;
  frequency: Map<number, number>;
  empDistrFunc: Map<number, number>;

  constructor(array?: Array<number>) {
    this.length = 0;
    this.data = [];
    this.count = new Map();
    this.frequency = new Map();
    this.empDistrFunc = new Map();

    if (typeof array === 'undefined') {
      return;
    }

    this.length = array.length;
    array
      .sort((a, b) => a - b)
      .forEach((elem) => {
        const index = this.data.indexOf(elem);
        if (index === -1) {
          this.count.set(this.data.length, 1);
          this.data.push(elem);
        } else {
          this.count.set(index, this.count.get(index) + 1);
        }
      });

    this.data.forEach((_elem, index) =>
      this.frequency.set(index, pretty(this.count.get(index) / this.length))
    );
    this.data.forEach((_elem, index) => {
      if (index == 0) {
        this.empDistrFunc.set(index, pretty(this.frequency.get(index)));
      } else {
        this.empDistrFunc.set(
          index,
          pretty(this.empDistrFunc.get(index - 1) + this.frequency.get(index))
        );
      }
    });
    this.empDistrFunc.set(this.data.length - 1, 1);
  }
}
