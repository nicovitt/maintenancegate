export class Permissions {
  // This attribute says whether these are the default permissions or if they were collected from the backend.
  // If not they should be looked up there.
  $gotpermissionsfrombackend: boolean = false;
  caneditticket: boolean = false;
  caneditschedule: boolean = false;
}
