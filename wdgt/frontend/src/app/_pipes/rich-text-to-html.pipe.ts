import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'RichTextToHtml'
})

export class RichTextToHtmlPipe implements PipeTransform {
    public transform(markdown: string): string {
        let currentPos = 0;
        let prevPos = 0;
        let result = '';
        let needFinishTag = false;
        while (currentPos >= 0) {
          currentPos = markdown.indexOf('**', prevPos);
          if (currentPos >= 0) {
            result += markdown.substring(prevPos, currentPos) + (needFinishTag ? '</strong>' : '<strong>');
            prevPos = currentPos + 2;
            needFinishTag = !needFinishTag;
          }
        }
        result += markdown.substring(prevPos);
        if (needFinishTag) {
          result += '</strong>';
        }
        return result;
    }
}
