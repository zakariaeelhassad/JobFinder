import { ResolveFn } from '@angular/router';

export const jobResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
