from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from redis import Redis
from models import db
from routes import bp
from config import Config
from flask_jwt_extended import JWTManager
from auth import auth_bp, jwt
from datetime import timedelta

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["JWT_SECRET_KEY"] = "secret"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=30)
    jwt.init_app(app)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")


    # DB + Migrations
    db.init_app(app)
    Migrate(app, db)

    # Redis
    app.redis = Redis.from_url(app.config["REDIS_URL"])

    # CORS
    CORS(app)
    
    # Register routes
    app.register_blueprint(bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
