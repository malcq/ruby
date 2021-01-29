import uuid from 'uuid/v4';
import { IOption } from '../models/select';

type Search = {
  type: string;
  allOptions: IOption[],
  dict: {[key: string]: IOption[]},
  dictKeys: string[],
  phonems: {[key: string]: IOption[]}
};

type ServerElem = {
  id?: string,
  value?: string,
  title?: string,
  synonyms?: string[]
};

type WorkerTask = {
  name: string,
  searchId: string,
  data: any,
  onAnswer?: (result: any) => void,
  onCancel?: () => void
};

const searches: {[id: string]: Search} = {};
let optId = 1;

function namesInfo() {searches.toString();optId.toString()}

function prepareWord(word: string): string {
  return word.trim().toLowerCase();
}

function doubleMetaphone(value: string): string[] {
  // Match vowels (including `Y`).
  const vowels = /[AEIOUY]/;

  // Match few Slavo-Germanic values.
  const slavoGermanic = /W|K|CZ|WITZ/;

  // Match few Germanic values.
  const germanic = /^(VAN |VON |SCH)/;

  // Match initial values of which the first character should be skipped.
  const initialExceptions = /^(GN|KN|PN|WR|PS)/;

  // Match initial Greek-like values of which the `CH` sounds like `K`.
  const initialGreekCh = /^CH(IA|EM|OR([^E])|YM|ARAC|ARIS)/;

  // Match Greek-like values of which the `CH` sounds like `K`.
  const greekCh = /ORCHES|ARCHIT|ORCHID/;

  // Match values which when following `CH`, transform `CH` to sound like `K`.
  const chForKh = /[ BFHLMNRVW]/;

  // Match values which when preceding a vowel and `UGH`, sound like `F`.
  const gForF = /[CGLRT]/;

  // Match initial values which sound like either `K` or `J`.
  const initialGForKj = /Y[\s\S]|E[BILPRSY]|I[BELN]/;

  // Match initial values which sound like either `K` or `J`.
  const initialAngerException = /^[DMR]ANGER/;

  // Match values which when following `GY`, do not sound like `K` or `J`.
  const gForKj = /[EGIR]/;

  // Match values which when following `J`, do not sound `J`.
  const jForJException = /[LTKSNMBZ]/;

  // Match values which might sound like `L`.
  const alle = /AS|OS/;

  // Match Germanic values preceding `SH` which sound like `S`.
  const hForS = /EIM|OEK|OLM|OLZ/;

  // Match Dutch values following `SCH` which sound like either `X` and `SK`,
  // or `SK`.
  const dutchSch = /E[DMNR]|UY|OO/;

  // Get the phonetics according to the Double Metaphone algorithm from a value.
  // eslint-disable-next-line complexity
  let primary = '';
  let secondary = '';
  let index = 0;
  let length = value.length;
  let last = length - 1;
  let subvalue;
  let next;
  let prev;
  let nextnext;

  value = String(value).toUpperCase() + '     ';
  const characters = value.split('');
  const isSlavoGermanic = slavoGermanic.test(value);
  const isGermanic = germanic.test(value);

  // Skip this at beginning of word.
  if (initialExceptions.test(value)) {
    index++
  }

  // Initial X is pronounced Z, which maps to S. Such as `Xavier`.
  if (characters[0] === 'X') {
    primary += 'S'
    secondary += 'S'
    index++
  }

  while (index < length) {
    prev = characters[index - 1];
    next = characters[index + 1];
    nextnext = characters[index + 2];

    switch (characters[index]) {
      case 'A':
      case 'E':
      case 'I':
      case 'O':
      case 'U':
      case 'Y':
      case 'À':
      case 'Ê':
      case 'É':
        if (index === 0) {
          // All initial vowels now map to `A`.
          primary += 'A'
          secondary += 'A'
        }

        index++

        break
      case 'B':
        primary += 'P'
        secondary += 'P'

        if (next === 'B') {
          index++
        }

        index++

        break
      case 'Ç':
        primary += 'S'
        secondary += 'S'
        index++

        break
      case 'C':
        // Various Germanic:
        if (
          prev === 'A' &&
          next === 'H' &&
          nextnext !== 'I' &&
          !vowels.test(characters[index - 2]) &&
          (nextnext !== 'E' ||
            (subvalue =
              value.slice(index - 2, index + 4) &&
              (subvalue === 'BACHER' || subvalue === 'MACHER')))
        ) {
          primary += 'K'
          secondary += 'K'
          index += 2

          break
        }

        // Special case for `Caesar`.
        if (index === 0 && value.slice(index + 1, index + 6) === 'AESAR') {
          primary += 'S'
          secondary += 'S'
          index += 2

          break
        }

        // Italian `Chianti`.
        if (value.slice(index + 1, index + 4) === 'HIA') {
          primary += 'K'
          secondary += 'K'
          index += 2

          break
        }

        if (next === 'H') {
          // Find `Michael`.
          if (index > 0 && nextnext === 'A' && characters[index + 3] === 'E') {
            primary += 'K'
            secondary += 'X'
            index += 2

            break
          }

          // Greek roots such as `chemistry`, `chorus`.
          if (index === 0 && initialGreekCh.test(value)) {
            primary += 'K'
            secondary += 'K'
            index += 2

            break
          }

          // Germanic, Greek, or otherwise `CH` for `KH` sound.
          if (
            isGermanic ||
            // Such as 'architect' but not 'arch', orchestra', 'orchid'.
            greekCh.test(value.slice(index - 2, index + 4)) ||
            (nextnext === 'T' || nextnext === 'S') ||
            ((index === 0 ||
              prev === 'A' ||
              prev === 'E' ||
              prev === 'O' ||
              prev === 'U') &&
              // Such as `wachtler`, `weschsler`, but not `tichner`.
              chForKh.test(nextnext))
          ) {
            primary += 'K'
            secondary += 'K'
          } else if (index === 0) {
            primary += 'X'
            secondary += 'X'
            // Such as 'McHugh'.
          } else if (value.slice(0, 2) === 'MC') {
            // Bug? Why matching absolute? what about McHiccup?
            primary += 'K'
            secondary += 'K'
          } else {
            primary += 'X'
            secondary += 'K'
          }

          index += 2

          break
        }

        // Such as `Czerny`.
        if (next === 'Z' && value.slice(index - 2, index) !== 'WI') {
          primary += 'S'
          secondary += 'X'
          index += 2

          break
        }

        // Such as `Focaccia`.
        if (value.slice(index + 1, index + 4) === 'CIA') {
          primary += 'X'
          secondary += 'X'
          index += 3

          break
        }

        // Double `C`, but not `McClellan`.
        if (next === 'C' && !(index === 1 && characters[0] === 'M')) {
          // Such as `Bellocchio`, but not `Bacchus`.
          if (
            (nextnext === 'I' || nextnext === 'E' || nextnext === 'H') &&
            value.slice(index + 2, index + 4) !== 'HU'
          ) {
            subvalue = value.slice(index - 1, index + 4)

            // Such as `Accident`, `Accede`, `Succeed`.
            if (
              (index === 1 && prev === 'A') ||
              subvalue === 'UCCEE' ||
              subvalue === 'UCCES'
            ) {
              primary += 'KS'
              secondary += 'KS'
              // Such as `Bacci`, `Bertucci`, other Italian.
            } else {
              primary += 'X'
              secondary += 'X'
            }

            index += 3

            break
          } else {
            // Pierce's rule.
            primary += 'K'
            secondary += 'K'
            index += 2

            break
          }
        }

        if (next === 'G' || next === 'K' || next === 'Q') {
          primary += 'K'
          secondary += 'K'
          index += 2

          break
        }

        // Italian.
        if (
          next === 'I' &&
          // Bug: The original algorithm also calls for A (as in CIA), which is
          // already taken care of above.
          (nextnext === 'E' || nextnext === 'O')
        ) {
          primary += 'S'
          secondary += 'X'
          index += 2

          break
        }

        if (next === 'I' || next === 'E' || next === 'Y') {
          primary += 'S'
          secondary += 'S'
          index += 2

          break
        }

        primary += 'K'
        secondary += 'K'

        // Skip two extra characters ahead in `Mac Caffrey`, `Mac Gregor`.
        if (
          next === ' ' &&
          (nextnext === 'C' || nextnext === 'G' || nextnext === 'Q')
        ) {
          index += 3
          break
        }

        // Bug: Already covered above.
        // if (
        //   next === 'K' ||
        //   next === 'Q' ||
        //   (next === 'C' && nextnext !== 'E' && nextnext !== 'I')
        // ) {
        //   index++;
        // }

        index++

        break
      case 'D':
        if (next === 'G') {
          // Such as `edge`.
          if (nextnext === 'E' || nextnext === 'I' || nextnext === 'Y') {
            primary += 'J'
            secondary += 'J'
            index += 3
            // Such as `Edgar`.
          } else {
            primary += 'TK'
            secondary += 'TK'
            index += 2
          }

          break
        }

        if (next === 'T' || next === 'D') {
          primary += 'T'
          secondary += 'T'
          index += 2

          break
        }

        primary += 'T'
        secondary += 'T'
        index++

        break
      case 'F':
        if (next === 'F') {
          index++
        }

        index++
        primary += 'F'
        secondary += 'F'

        break
      case 'G':
        if (next === 'H') {
          if (index > 0 && !vowels.test(prev)) {
            primary += 'K'
            secondary += 'K'
            index += 2

            break
          }

          // Such as `Ghislane`, `Ghiradelli`.
          if (index === 0) {
            if (nextnext === 'I') {
              primary += 'J'
              secondary += 'J'
            } else {
              primary += 'K'
              secondary += 'K'
            }

            index += 2

            break
          }

          // Parker's rule (with some further refinements).
          if (
            // Such as `Hugh`.  The comma is not a bug.
            ((subvalue = characters[index - 2]),
            subvalue === 'B' || subvalue === 'H' || subvalue === 'D') ||
            // Such as `bough`.  The comma is not a bug.
            ((subvalue = characters[index - 3]),
            subvalue === 'B' || subvalue === 'H' || subvalue === 'D') ||
            // Such as `Broughton`.  The comma is not a bug.
            ((subvalue = characters[index - 4]),
            subvalue === 'B' || subvalue === 'H')
          ) {
            index += 2

            break
          }

          // Such as `laugh`, `McLaughlin`, `cough`, `gough`, `rough`, `tough`.
          if (index > 2 && prev === 'U' && gForF.test(characters[index - 3])) {
            primary += 'F'
            secondary += 'F'
          } else if (index > 0 && prev !== 'I') {
            primary += 'K'
            secondary += 'K'
          }

          index += 2

          break
        }

        if (next === 'N') {
          if (index === 1 && vowels.test(characters[0]) && !isSlavoGermanic) {
            primary += 'KN'
            secondary += 'N'
            // Not like `Cagney`.
          } else if (
            value.slice(index + 2, index + 4) !== 'EY' &&
            value.slice(index + 1) !== 'Y' &&
            !isSlavoGermanic
          ) {
            primary += 'N'
            secondary += 'KN'
          } else {
            primary += 'KN'
            secondary += 'KN'
          }

          index += 2

          break
        }

        // Such as `Tagliaro`.
        if (value.slice(index + 1, index + 3) === 'LI' && !isSlavoGermanic) {
          primary += 'KL'
          secondary += 'L'
          index += 2

          break
        }

        // -ges-, -gep-, -gel- at beginning.
        if (index === 0 && initialGForKj.test(value.slice(1, 3))) {
          primary += 'K'
          secondary += 'J'
          index += 2

          break
        }

        // -ger-, -gy-.
        if (
          (value.slice(index + 1, index + 3) === 'ER' &&
            prev !== 'I' &&
            prev !== 'E' &&
            !initialAngerException.test(value.slice(0, 6))) ||
          (next === 'Y' && !gForKj.test(prev))
        ) {
          primary += 'K'
          secondary += 'J'
          index += 2

          break
        }

        // Italian such as `biaggi`.
        if (
          next === 'E' ||
          next === 'I' ||
          next === 'Y' ||
          ((prev === 'A' || prev === 'O') && next === 'G' && nextnext === 'I')
        ) {
          // Obvious Germanic.
          if (value.slice(index + 1, index + 3) === 'ET' || isGermanic) {
            primary += 'K'
            secondary += 'K'
          } else {
            primary += 'J'

            // Always soft if French ending.
            if (value.slice(index + 1, index + 5) === 'IER ') {
              secondary += 'J'
            } else {
              secondary += 'K'
            }
          }

          index += 2

          break
        }

        if (next === 'G') {
          index++
        }

        index++

        primary += 'K'
        secondary += 'K'

        break
      case 'H':
        // Only keep if first & before vowel or btw. 2 vowels.
        if (vowels.test(next) && (index === 0 || vowels.test(prev))) {
          primary += 'H'
          secondary += 'H'

          index++
        }

        index++

        break
      case 'J':
        // Obvious Spanish, `jose`, `San Jacinto`.
        if (
          value.slice(index, index + 4) === 'JOSE' ||
          value.slice(0, 4) === 'SAN '
        ) {
          if (
            value.slice(0, 4) === 'SAN ' ||
            (index === 0 && characters[index + 4] === ' ')
          ) {
            primary += 'H'
            secondary += 'H'
          } else {
            primary += 'J'
            secondary += 'H'
          }

          index++

          break
        }

        if (
          index === 0
          // Bug: unreachable (see previous statement).
          // && value.slice(index, index + 4) !== 'JOSE'.
        ) {
          primary += 'J'

          // Such as `Yankelovich` or `Jankelowicz`.
          secondary += 'A'
          // Spanish pron. of such as `bajador`.
        } else if (
          !isSlavoGermanic &&
          (next === 'A' || next === 'O') &&
          vowels.test(prev)
        ) {
          primary += 'J'
          secondary += 'H'
        } else if (index === last) {
          primary += 'J'
        } else if (
          prev !== 'S' &&
          prev !== 'K' &&
          prev !== 'L' &&
          !jForJException.test(next)
        ) {
          primary += 'J'
          secondary += 'J'
          // It could happen.
        } else if (next === 'J') {
          index++
        }

        index++

        break
      case 'K':
        if (next === 'K') {
          index++
        }

        primary += 'K'
        secondary += 'K'
        index++

        break
      case 'L':
        if (next === 'L') {
          // Spanish such as `cabrillo`, `gallegos`.
          if (
            (index === length - 3 &&
              ((prev === 'A' && nextnext === 'E') ||
                (prev === 'I' && (nextnext === 'O' || nextnext === 'A')))) ||
            (prev === 'A' &&
              nextnext === 'E' &&
              (characters[last] === 'A' ||
                characters[last] === 'O' ||
                alle.test(value.slice(last - 1, length))))
          ) {
            primary += 'L'
            index += 2

            break
          }

          index++
        }

        primary += 'L'
        secondary += 'L'
        index++

        break
      case 'M':
        if (
          next === 'M' ||
          // Such as `dumb`, `thumb`.
          (prev === 'U' &&
            next === 'B' &&
            (index + 1 === last || value.slice(index + 2, index + 4) === 'ER'))
        ) {
          index++
        }

        index++
        primary += 'M'
        secondary += 'M'

        break
      case 'N':
        if (next === 'N') {
          index++
        }

        index++
        primary += 'N'
        secondary += 'N'

        break
      case 'Ñ':
        index++
        primary += 'N'
        secondary += 'N'

        break
      case 'P':
        if (next === 'H') {
          primary += 'F'
          secondary += 'F'
          index += 2

          break
        }

        // Also account for `campbell` and `raspberry`.
        subvalue = next

        if (subvalue === 'P' || subvalue === 'B') {
          index++
        }

        index++

        primary += 'P'
        secondary += 'P'

        break
      case 'Q':
        if (next === 'Q') {
          index++
        }

        index++
        primary += 'K'
        secondary += 'K'

        break
      case 'R':
        // French such as `Rogier`, but exclude `Hochmeier`.
        if (
          index === last &&
          !isSlavoGermanic &&
          prev === 'E' &&
          characters[index - 2] === 'I' &&
          characters[index - 4] !== 'M' &&
          (characters[index - 3] !== 'E' && characters[index - 3] !== 'A')
        ) {
          secondary += 'R'
        } else {
          primary += 'R'
          secondary += 'R'
        }

        if (next === 'R') {
          index++
        }

        index++

        break
      case 'S':
        // Special cases `island`, `isle`, `carlisle`, `carlysle`.
        if (next === 'L' && (prev === 'I' || prev === 'Y')) {
          index++

          break
        }

        // Special case `sugar-`.
        if (index === 0 && value.slice(1, 5) === 'UGAR') {
          primary += 'X'
          secondary += 'S'
          index++

          break
        }

        if (next === 'H') {
          // Germanic.
          if (hForS.test(value.slice(index + 1, index + 5))) {
            primary += 'S'
            secondary += 'S'
          } else {
            primary += 'X'
            secondary += 'X'
          }

          index += 2
          break
        }

        if (
          next === 'I' &&
          (nextnext === 'O' || nextnext === 'A')
          // Bug: Already covered by previous branch
          // || value.slice(index, index + 4) === 'SIAN'
        ) {
          if (isSlavoGermanic) {
            primary += 'S'
            secondary += 'S'
          } else {
            primary += 'S'
            secondary += 'X'
          }

          index += 3

          break
        }

        // German & Anglicization's, such as `Smith` match `Schmidt`, `snider`
        // match `Schneider`. Also, -sz- in slavic language although in
        // hungarian it is pronounced `s`.
        if (
          next === 'Z' ||
          (index === 0 &&
            (next === 'L' || next === 'M' || next === 'N' || next === 'W'))
        ) {
          primary += 'S'
          secondary += 'X'

          if (next === 'Z') {
            index++
          }

          index++

          break
        }

        if (next === 'C') {
          // Schlesinger's rule.
          if (nextnext === 'H') {
            subvalue = value.slice(index + 3, index + 5)

            // Dutch origin, such as `school`, `schooner`.
            if (dutchSch.test(subvalue)) {
              // Such as `schermerhorn`, `schenker`.
              if (subvalue === 'ER' || subvalue === 'EN') {
                primary += 'X'
                secondary += 'SK'
              } else {
                primary += 'SK'
                secondary += 'SK'
              }

              index += 3

              break
            }

            if (
              index === 0 &&
              !vowels.test(characters[3]) &&
              characters[3] !== 'W'
            ) {
              primary += 'X'
              secondary += 'S'
            } else {
              primary += 'X'
              secondary += 'X'
            }

            index += 3

            break
          }

          if (nextnext === 'I' || nextnext === 'E' || nextnext === 'Y') {
            primary += 'S'
            secondary += 'S'
            index += 3
            break
          }

          primary += 'SK'
          secondary += 'SK'
          index += 3

          break
        }

        subvalue = value.slice(index - 2, index)

        // French such as `resnais`, `artois`.
        if (index === last && (subvalue === 'AI' || subvalue === 'OI')) {
          secondary += 'S'
        } else {
          primary += 'S'
          secondary += 'S'
        }

        if (
          next === 'S'
          // Bug: already taken care of by `German & Anglicization's` above:
          // || next === 'Z'
        ) {
          index++
        }

        index++

        break
      case 'T':
        if (next === 'I' && nextnext === 'O' && characters[index + 3] === 'N') {
          primary += 'X'
          secondary += 'X'
          index += 3

          break
        }

        subvalue = value.slice(index + 1, index + 3)

        if (
          (next === 'I' && nextnext === 'A') ||
          (next === 'C' && nextnext === 'H')
        ) {
          primary += 'X'
          secondary += 'X'
          index += 3

          break
        }

        if (next === 'H' || (next === 'T' && nextnext === 'H')) {
          // Special case `Thomas`, `Thames` or Germanic.
          if (
            isGermanic ||
            ((nextnext === 'O' || nextnext === 'A') &&
              characters[index + 3] === 'M')
          ) {
            primary += 'T'
            secondary += 'T'
          } else {
            primary += '0'
            secondary += 'T'
          }

          index += 2

          break
        }

        if (next === 'T' || next === 'D') {
          index++
        }

        index++
        primary += 'T'
        secondary += 'T'

        break
      case 'V':
        if (next === 'V') {
          index++
        }

        primary += 'F'
        secondary += 'F'
        index++

        break
      case 'W':
        // Can also be in middle of word (as already taken care of for initial).
        if (next === 'R') {
          primary += 'R'
          secondary += 'R'
          index += 2

          break
        }

        if (index === 0) {
          // `Wasserman` should match `Vasserman`.
          if (vowels.test(next)) {
            primary += 'A'
            secondary += 'F'
          } else if (next === 'H') {
            // Need `Uomo` to match `Womo`.
            primary += 'A'
            secondary += 'A'
          }
        }

        // `Arnow` should match `Arnoff`.
        if (
          ((prev === 'E' || prev === 'O') &&
            next === 'S' &&
            nextnext === 'K' &&
            (characters[index + 3] === 'I' || characters[index + 3] === 'Y')) ||
          // Maybe a bug? Shouldn't this be general Germanic?
          value.slice(0, 3) === 'SCH' ||
          (index === last && vowels.test(prev))
        ) {
          secondary += 'F'
          index++

          break
        }

        // Polish such as `Filipowicz`.
        if (
          next === 'I' &&
          (nextnext === 'C' || nextnext === 'T') &&
          characters[index + 3] === 'Z'
        ) {
          primary += 'TS'
          secondary += 'FX'
          index += 4

          break
        }

        index++

        break
      case 'X':
        // French such as `breaux`.
        if (
          !(
            index === last &&
            // Bug: IAU and EAU also match by AU
            // (/IAU|EAU/.test(value.slice(index - 3, index))) ||
            (prev === 'U' &&
              (characters[index - 2] === 'A' || characters[index - 2] === 'O'))
          )
        ) {
          primary += 'KS'
          secondary += 'KS'
        }

        if (next === 'C' || next === 'X') {
          index++
        }

        index++

        break
      case 'Z':
        // Chinese pinyin such as `Zhao`.
        if (next === 'H') {
          primary += 'J'
          secondary += 'J'
          index += 2

          break
        } else if (
          (next === 'Z' &&
            (nextnext === 'A' || nextnext === 'I' || nextnext === 'O')) ||
          (isSlavoGermanic && index > 0 && prev !== 'T')
        ) {
          primary += 'S'
          secondary += 'TS'
        } else {
          primary += 'S'
          secondary += 'S'
        }

        if (next === 'Z') {
          index++
        }

        index++

        break
      default:
        index++
    }
  }
  return [primary, secondary];
};


function addVal(search: Search, word: string, value: IOption) {
  const key = prepareWord(word);

  if(key === '') return;

  if(search.dict[key]) {
    search.dict[key].push(value);
  } else {
    search.dict[key] = [value];
  }
  doubleMetaphone(key).forEach((phKey: string) => {
    if(search.phonems[phKey]) {
      search.phonems[phKey].push(value);
    } else {
      search.phonems[phKey] = [value];
    }
  });
}

function initSearchR(searchId: string, type: string, data: ServerElem[]): Promise<void> {
  const search: Search = {
    type,
    allOptions: [],
    dict: {},
    dictKeys: [],
    phonems: {}
  };

  data.forEach((elem: ServerElem) => {
    const { value } = elem;
    const title = elem.title || value || '';
    const id = elem.id || `opt-${optId++}`;
    const option = {
      id,
      title,
    }
    search.allOptions.push(option);
    addVal(search, title, option);
    if(elem.synonyms) {
      elem.synonyms.forEach(synonym => addVal(search, synonym, option));
    }
  });

  search.dictKeys = Object.keys(search.dict);

  searches[searchId] = search;

  return Promise.resolve();
}

function getSearch(searchId: string): Search {
  const search: Search = searches[searchId];
  if(!search) throw(new Error(`Search with id="${searchId}" not found.`));
  return search;
}

function searchR(searchId: string, searchText: string): Promise<IOption[]> {
  const search: Search = getSearch(searchId);

  let limit = 0;

  if (searchText === '') {
    if (search.type === 'autocomplete') {
      return Promise.resolve([]);
    }
    return Promise.resolve(search.allOptions);
  }
  if (search.type === 'autocomplete') {
    limit = 6;
  }
  
  const result: IOption[] = [];
  const seen = new Set<IOption>();
  function addResult(options: IOption[] | null | undefined): boolean {
    if (!options) return false;
    return options.some((option: IOption) => {
      if (seen.has(option)) return false;
      if (limit && result.length >= limit) return true;
      seen.add(option);
      result.push(option);
      return false;
    });
  }

  const key = prepareWord(searchText);
  doubleMetaphone(key).some((phKey: string) => addResult(search.phonems[phKey]));

  search.dictKeys.some(sample => {
    if(~sample.indexOf(key)) {
      return addResult(search.dict[sample]);
    }
    return false;
  });

  return Promise.resolve(result);
}

function getPositionR(searchId: string, id: string): Promise<number> {
  const search: Search = getSearch(searchId);
  let i=0;
  for (; i<search.allOptions.length; i++) {
    if (search.allOptions[i].id === id) {
      break;
    }
  }

  if(i === search.allOptions.length) {
    return Promise.reject(new Error(`Position not found.`));
  }

  return Promise.resolve(i);
}

function getByPositionR(searchId: string, position: number): Promise<IOption> {
  const search: Search = getSearch(searchId);
  if(position< 0 || position>=search.allOptions.length) {
    return Promise.reject(new Error(`Position "${position}" out of search massive.`));
  }

  return Promise.resolve(search.allOptions[position]);
}

let workerQuery: WorkerTask[] = [];
let currentWorkerTask: WorkerTask | null;
let worker: Worker;

function tryProcessTask(): void {
  if(!currentWorkerTask && workerQuery.length) {
    if(workerQuery[0].name === 'search') {
      let lastTask = workerQuery[0];
      workerQuery = workerQuery.filter(task => {
        if (task.searchId === lastTask.searchId && task.name === 'search') {
          if (lastTask !== task) {
            if(lastTask.onCancel) {
              lastTask.onCancel();
            }
            lastTask = task;
          }
          return false;
        }
        return true;
      });
      currentWorkerTask = lastTask;
    } else {
      currentWorkerTask = workerQuery.shift()!;
    }
    const { name, searchId, data } = currentWorkerTask;
    worker.postMessage({
      name, searchId, data
    });
  }
}

function startWorkerTask(workerTask: WorkerTask): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    workerTask.onAnswer = resolve;
    workerTask.onCancel = () => reject(new Error('Search canceled'));
    workerQuery.push(workerTask);
    tryProcessTask();
  });
}

let initSearchL:  (searchId: string, type: string, data: ServerElem[]) => Promise<void>;
let searchL:  (searchId: string, searchText: string) => Promise<IOption[]>;
let getPositionL: (searchId: string, id: string) =>  Promise<number>;
let getByPositionL: (searchId: string, position: number) => Promise<IOption>;

function getName(func: any) {
  return func.toString().match(/^function (.+?)\(/)[1];
}

if (window.Worker) {
  const names = namesInfo.toString().match(/(\{\s*|,\s*|;\s*)(.+?)\./g)!.map(a => a.substr(1,a.length-2));
  const workerRunner = `
    const ${names[0]} = {};
    let ${names[1]} = 1;

    self.onmessage = function(event) {
      if(event.data.name === 'initSearch') {
        ${getName(initSearchR)}(event.data.searchId, event.data.data.type, event.data.data.data)
          .then(() => {
            self.postMessage('Done');
          });
      } else if(event.data.name === 'search') {
        ${getName(searchR)}(event.data.searchId, event.data.data.searchText)
          .then((result) => {
            self.postMessage(result);
          });
      } else if(event.data.name === 'getPosition') {
        ${getName(getPositionR)}(event.data.searchId, event.data.data.id)
          .then((result) => {
            self.postMessage(result);
          });
      } else if(event.data.name === 'getByPosition') {
        ${getName(getByPositionR)}(event.data.searchId, event.data.data.position)
          .then((result) => {
            self.postMessage(result);
          });
      }
    }
  `;
  let script: string = doubleMetaphone.toString();
  script += prepareWord.toString();
  script += addVal.toString();
  script += initSearchR.toString();
  script += getSearch.toString();
  script += searchR.toString();
  script += getPositionR.toString();
  script += getByPositionR.toString();
  script += workerRunner;

  const workerBlob = new Blob(
      [script],
      { type:'text/javascript' }
    );
  const workerBlobUrl = URL.createObjectURL(workerBlob);
  worker = new Worker(workerBlobUrl);

  worker.onmessage = (event) => {
    if(currentWorkerTask && currentWorkerTask.onAnswer) {
      currentWorkerTask.onAnswer(event.data);
      currentWorkerTask = null;
      tryProcessTask();
    }
  };

  initSearchL = (searchId: string, type: string, data: ServerElem[]):  Promise<void> => {
    return startWorkerTask({
      name: 'initSearch',
      searchId,
      data: {
        type,
        data
      }
    });
  };
  
  searchL = (searchId: string, searchText: string): Promise<IOption[]> => {
    return startWorkerTask({
      name: 'search',
      searchId,
      data: {
        searchText
      }
    });
  };
  
  getPositionL = (searchId: string, id: string): Promise<number> => {
    return startWorkerTask({
      name: 'getPosition',
      searchId,
      data: {
        id
      }
    });
  };
  
  getByPositionL = (searchId: string, position: number): Promise<IOption> => {
    return startWorkerTask({
      name: 'getByPosition',
      searchId,
      data: {
        position
      }
    });
  };
} else {
  initSearchL = initSearchR;
  searchL = searchR;
  getPositionL = getPositionR;
  getByPositionL = getByPositionR;
}


export const initSearch = async (type: string, data: ServerElem[]):  Promise<string> => {
  const searchId = `search-${uuid()}`;

  initSearchL(searchId, type, data);
  
  return searchId;
};

export const search = async (searchId: string, searchText: string): Promise<IOption[]> => {
  return await searchL(searchId, searchText);
};

export const getPosition = async (searchId: string, id: string): Promise<number> => {
  return await getPositionL(searchId, id);
};

export const getByPosition = async (searchId: string, position: number): Promise<IOption> => {
  return await getByPositionL(searchId, position);
};

/*
chatService.fakeMessage([{"sender":"bot","text":{"type":"text","options":{"text":"Hi, I am your Planet sports Service bot. How can I be of service today?"}},"type":"message","user_id":3548,"payload":[],"state_id":1358,"message_id":4130},
{"sender":"bot","type":"complex","user_id":3548,"payload":[{"id":"act-dc9fafb0-da12-11e9-a272-95868a15a561","next":{"default":"32b085d0-c98a-11e9-89de-3d11ced179ee"},"type":"autocomplete","options":{"title":"Test","options":[
  {
    value: 'Test',
    synonyms: ['analysis', 'approval', 'assessment', 'attempt', 'check', 'evaluation', 'experiment', 'final', 'inquiry', 'inspection', '']
  },
  {
    value: 'Engine',
    synonyms: ['appliance', 'diesel', 'generator', 'instrument', 'motor', 'power plant', '', '']
  },
]},"actionOptions":{}},{"id":"act-dc9fafb1-da12-11e9-a272-95868a15a561","next":{"default":null},"type":"phone_call","options":{"title":"Call","phone_call":"+1234567890"},"actionOptions":{}}],"state_id":1358,"message_id":4131}]);
*/