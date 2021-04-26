import {
  trigger,
  transition, animate, style, state,
} from '@angular/animations';

export const filterDialogExpand = trigger('filterDialogExpand', [
  state('collapsed', style({ boxShadow: 'none', visibility: 'hidden' })),
  state('expanded', style({ transform: 'none', visibility: 'visible' })),
  transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

export const contentDialogMarginExpand = trigger('contentDialogMarginExpand', [
  state('collapsed', style({ marginLeft: '-{{margin_left}}px' }),
    { params: { margin_left: '0' } }),
  state('expanded', style({}),
    { params: { margin_left: '0' } }),
  transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
]);
