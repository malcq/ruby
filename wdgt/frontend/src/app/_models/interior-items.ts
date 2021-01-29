/**
 * Note that interfaces could be changed after api revision
 * Current implementation only for mocked menu
 */

export interface InteriorMenuItem {
  id: number;
  title: string;
  child?: InteriorItem;
}

export interface InteriorItem {
  id?: number;
  parent?: number;
  title: string;
  image: string;
  menu: InteriorMenuItem[];
}
