class Post {
  constructor(
    user_id,
    first_name,
    last_name,
    user_image,
    content,
    image,
    like,
    comments,
    created_at,
    update_at
  ) {
    this.user_id = user_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.user_image = user_image;
    this.content = content;
    this.image = image;
    this.like = like;
    this.comments = comments;
    this.created_at = created_at;
    this.update_at = update_at;
  }
}

module.exports = { Post };
