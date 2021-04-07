import {
  trigger,
  transition, animate, style, state,
} from '@angular/animations';

export const filterExpand = trigger('filterExpand', [
  state('collapsed', style({ width: '0px', minWidth: '0', visibility: 'hidden', padding: '0px' })),
  state('expanded', style({ width: '*', visibility: 'visible', padding: '10px', paddingRight: '20px' })),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);
