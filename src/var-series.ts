export class Series {
  data: Map<number, number>;

  constructor(array: Array<number>) {
    this.data = new Map<number, number>();

    array
      .sort((a, b) => a - b)
      .forEach((element) => {
        if (this.data.has(element)) {
          this.data.set(element, this.data.get(element) + 1);
        } else {
          this.data.set(element, 1);
        }
      });
  }
}
