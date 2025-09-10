from sqlalchemy.orm import aliased
from sqlalchemy import desc
import json 
from flask import Blueprint, request, jsonify, current_app 
from sqlalchemy import or_ 
from models import db, BlogPost, Comment 
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("api", __name__, url_prefix="/api")

# Create Post 
@bp.route("/posts", methods=["POST"])
@jwt_required()
def create_post():
    data = request.get_json()
    if not data.get("title") or not data.get("content"):
        return jsonify({"error": "Missing title or content"}), 400

    #Get the username of the logged-in user
    current_user = get_jwt_identity()

    post = BlogPost(
        title=data["title"],
        content=data["content"],
        author=current_user  # use JWT identity instead of trusting client
    )
    db.session.add(post)
    db.session.commit()

    # Invalidate Redis caches
    current_app.redis.delete("popular_posts:views")
    current_app.redis.delete("popular_posts:comments")

    return jsonify({"message": "Post created", "id": post.id}), 201

# Get All Posts (with pagination + search)
@bp.route("/posts", methods=["GET"]) 
def get_posts(): 
    page = request.args.get("page", 1, type=int) 
    per_page = request.args.get("per_page", 5, type=int) 
    search = request.args.get("search", None) 
    query = BlogPost.query 
    if search: 
        query = query.filter(BlogPost.title.ilike(f"%{search}%")) 
    pagination = query.order_by(BlogPost.created_at.desc()).paginate( page=page, per_page=per_page, error_out=False ) 
    result = [ { "id": p.id, "title": p.title, "author": p.author, "views": p.views or 0, } for p in pagination.items ] 
    return jsonify({ "posts": result, "total": pagination.total, "page": pagination.page, "pages": pagination.pages, })

# Get One Post
@bp.route("/posts/<int:id>", methods=["PUT"])
@jwt_required()
def update_post(id):
    post = BlogPost.query.get_or_404(id)
    data = request.get_json()

    current_user = get_jwt_identity()
    if post.author != current_user:
        return jsonify({"error": "Unauthorized"}), 403

    post.title = data.get("title", post.title)
    post.content = data.get("content", post.content)
    db.session.commit()

    current_app.redis.delete("popular_posts:views")
    current_app.redis.delete("popular_posts:comments")

    comments = Comment.query.filter_by(post_id=post.id).order_by(Comment.created_at.asc()).all()
    comment_list = [
        {"id": c.id, "author": c.author, "content": c.content, "created_at": c.created_at.isoformat()}
        for c in comments
    ]

    return jsonify({
        "id": post.id,
        "title": post.title,
        "author": post.author,
        "content": post.content,
        "created_at": post.created_at.isoformat(),
        "views": post.views,
        "comments": comment_list
    })



# Update Post
@bp.route("/posts/<int:id>", methods=["PUT"])
@jwt_required()
def update_post(id):
    post = BlogPost.query.get_or_404(id)
    data = request.get_json()

    #Get current logged-in user
    current_user = get_jwt_identity()

    #Ensure only the author can update
    if post.author != current_user:
        return jsonify({"error": "Unauthorized"}), 403

    post.title = data.get("title", post.title)
    post.content = data.get("content", post.content)

    db.session.commit()

    # Invalidate caches
    current_app.redis.delete("popular_posts:views")
    current_app.redis.delete("popular_posts:comments")

    return jsonify({"message": "Post updated"})

# Delete Post
@bp.route("/posts/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_post(id):
    post = BlogPost.query.get_or_404(id)

    # Only the author can delete their own post
    current_user = get_jwt_identity()
    if post.author != current_user:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(post)
    db.session.commit()

    # Invalidate caches
    current_app.redis.delete("popular_posts:views")
    current_app.redis.delete("popular_posts:comments")

    return jsonify({"message": "Post deleted"})


# Create Comment
@bp.route("/posts/<int:post_id>/comments", methods=["POST"])
@jwt_required()
def create_comment(post_id):
    print("Authorization header:", request.headers.get("Authorization"))
    post = BlogPost.query.get_or_404(post_id)
    data = request.get_json()
    
    if not data.get("content"):
        return jsonify({"error": "Missing content"}), 400

    # Logged-in user is the author
    current_user = get_jwt_identity()

    comment = Comment(
        post_id=post.id,
        content=data["content"],
        author=current_user
    )

    db.session.add(comment)
    db.session.commit()

    # Invalidate caches
    current_app.redis.delete("recent_comments")
    current_app.redis.delete("popular_posts:comments")

    return jsonify({"message": "Comment added", "id": comment.id}), 201


# Get All Comments for a Post
@bp.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    post = BlogPost.query.get_or_404(post_id)
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)

    pagination = Comment.query.filter_by(post_id=post.id)\
                              .order_by(Comment.created_at.desc())\
                              .paginate(page=page, per_page=per_page, error_out=False)

    result = [
        {
            "id": c.id,
            "author": c.author,
            "content": c.content,
            "created_at": c.created_at.isoformat()
        } for c in pagination.items
    ]

    return jsonify({
        "items": result,
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages
    })

# Update Comment
@bp.route("/comments/<int:id>", methods=["PUT"])
@jwt_required()
def update_comment(id):
    comment = Comment.query.get_or_404(id)
    data = request.get_json()

    # Only the author can edit their own comment
    current_user = get_jwt_identity()
    if comment.author != current_user:
        return jsonify({"error": "Unauthorized"}), 403

    # Only update content, never author
    if "content" in data and data["content"].strip():
        comment.content = data["content"]

    db.session.commit()

    # Invalidate caches
    current_app.redis.delete("recent_comments")
    current_app.redis.delete("popular_posts:comments")

    return jsonify({"message": "Comment updated"})

# Delete Comment
@bp.route("/comments/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_comment(id):
    comment = Comment.query.get_or_404(id)

    # ✅ Only the author can delete their own comment
    current_user = get_jwt_identity()
    if comment.author != current_user:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(comment)
    db.session.commit()

    # Invalidate caches
    current_app.redis.delete("recent_comments")
    current_app.redis.delete("popular_posts:comments")

    return jsonify({"message": "Comment deleted"})

@bp.route("/posts/popular", methods=["GET"])
def get_popular_posts():
    by = request.args.get("by", "views")  # views or comments

    # check Redis first
    cache_key = f"popular_posts:{by}"
    cached = current_app.redis.get(cache_key)
    if cached:
        return jsonify(json.loads(cached))

    query = BlogPost.query
    if by == "comments":
        # join with Comment table to count comments
        query = query.outerjoin(Comment).group_by(BlogPost.id).order_by(db.func.count(Comment.id).desc())
    else:
        query = query.order_by(BlogPost.views.desc())

    posts = query.limit(5).all()
    result = [
        {"id": p.id, "title": p.title, "author": p.author, "views": p.views or 0}
        for p in posts
    ]

    # store in Redis for 60s
    current_app.redis.setex(cache_key, 60, json.dumps(result))
    return jsonify(result)


@bp.route("/comments/recent", methods=["GET"])
def get_recent_comments():
    cache_key = "recent_comments"
    cached = current_app.redis.get(cache_key)
    if cached:
        return jsonify(json.loads(cached))

    # Alias BlogPost to make sure we avoid conflicts
    bp_alias = aliased(BlogPost)

    comments = (
        db.session.query(Comment, bp_alias.title.label("post_title"))
        .join(bp_alias, bp_alias.id == Comment.post_id)
        .order_by(desc(Comment.created_at))
        .limit(5)
        .all()
    )

    result = [
        {
            "id": c.id,
            "post_id": c.post_id,
            "post_title": post_title,
            "author": c.author,
            "content": c.content,
            "created_at": c.created_at.isoformat(),
        }
        for c, post_title in comments
    ]

    current_app.redis.setex(cache_key, 60, json.dumps(result))
    return jsonify(result)
