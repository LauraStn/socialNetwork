class Comment {
  constructor(
    user_id,
    comment_id,
    first_name,
    last_name,
    user_image,
    content,
    created_at,
    update_at
  ) {
    this.user_id = user_id;
    this.comment_id = comment_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.user_image = user_image;
    this.content = content;
    this.createdAt = created_at;
    this.update_at = update_at;
  }
}

module.exports = { Comment };
