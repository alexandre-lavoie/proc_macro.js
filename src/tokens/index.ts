import Group from './group';
import Ident from './ident';
import Literal from './literal';
import Punct from './punct';

export const TOKENS = [Literal, Ident, Group, Punct];

export { Group, Ident, Literal, Punct };