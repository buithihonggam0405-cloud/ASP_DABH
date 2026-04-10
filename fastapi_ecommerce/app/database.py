from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Kết nối với SQLite (lưu file ecommerce.db tại thư mục gốc)
SQLALCHEMY_DATABASE_URL = "sqlite:///./ecommerce.db"

# engine để giao tiếp với DB. check_same_thread=False cần thiết cho SQLite trong FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal giúp tạo ra các session (phiên làm việc) độc lập với database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class để các Models kế thừa
Base = declarative_base()

# Dependency dùng để lấy session kết nối database cho mỗi request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
