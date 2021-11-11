export class User {
  active: boolean = true;
  login_failed: 0;
  verified: boolean = false;
  source: null;
  login: string = '';
  last_login: string = '';
  id: number = 0;
  updated_by_id: number = 0;
  organization_id: number = 0;
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  image: null;
  image_source: null;
  web: string = '';
  phone: string = '';
  fax: string = '';
  mobile: string = '';
  department: string = '';
  street: string = '';
  zip: string = '';
  city: string = '';
  country: string = '';
  address: string = '';
  vip: boolean = false;
  note: string = '';
  out_of_office: boolean = false;
  out_of_office_start_at: null;
  out_of_office_end_at: null;
  out_of_office_replacement_id: null;
  preferences: any = {};
  created_by_id: number = 0;
  created_at: string = '';
  updated_at: string = '';
  role_ids: Array<any> = [];
  organization_ids: Array<any> = [];
  authorization_ids: Array<any> = [];
  karma_user_ids: Array<any> = [];
  group_ids: GroupId<number>;
}

type GroupId<T extends number> = {
  [x in T]: [];
};
