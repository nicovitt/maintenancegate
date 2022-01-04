export class Group {
  id: number = 0;
  signature_id: number = 0;
  email_address_id: string = '';
  name: string = '';
  assignment_timeout: string = '';
  follow_up_possible: string = '';
  follow_up_assignment: boolean = false;
  active: boolean = false;
  note: string = '';
  updated_by_id: number = 0;
  created_by_id: number = 0;
  created_at: string = '';
  updated_at: string = '';
  user_ids: Array<number> = [];
}
