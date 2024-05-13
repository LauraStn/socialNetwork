class User {
  constructor(
    email,
    password,
    role_id,
    first_name,
    last_name,
    picture,
    gdpr,
    created_at,
    update_at,
    is_active,
    token
  ) {
    this.email = email;
    this.password = password;
    this.role_id = role_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.picture = picture;
    this.gdpr = gdpr;
    this.createdAt = created_at;
    this.updateAt = update_at;
    this.is_active = is_active;
    this.token = token;
  }
}

module.exports = { User };
