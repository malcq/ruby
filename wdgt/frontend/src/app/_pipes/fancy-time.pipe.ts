import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fancyTime'
})
export class FancyTimePipe implements PipeTransform {

  transform(
    time: number,
    withMs: boolean = true,
    reversed: boolean = false,
  ): any {
    return this.getFancyTime(time, {
      withMs,
      reversed,
    });
  }

  private getFancyTime(time: number, {
    withMs = true,
    reversed = false,
  } = {}) {
    let i = Math.floor(time / 10);
    const msec = this.twoDig(i % 100);
    i = Math.floor(i / 100);
    const sec = this.twoDig(i % 60);
    const min = this.twoDig( Math.floor(i / 60));
    const prefix = reversed ? this.getPrefix(time) : '';

    if (withMs) {
      return prefix + `${min}:${sec}.${msec}`;
    }

    return prefix + `${min}:${sec}`;
  }

  private twoDig(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  private getPrefix(number) {
    // To exclude -00:00 we are checking equality to 1 second, not 0
    if (number > 1000 || number < 0) { return '-'; }
    return '';
  }
}
