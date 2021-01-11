export class emailNoti {
  public Id: string;
  public email: string;
  public created_date: string;
  public modified_date: string;

  constructor(
    Id: string,
    email: string,
    created_date: string,
    modified_date: string,

  ) {
    this.Id = Id;
    this.email = email;
    this.created_date = created_date;
    this.modified_date = modified_date;
  }
}
