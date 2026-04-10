# FastAPI E-Commerce
Một trang web bán hàng đơn giản được xây dựng bằng:
- **Backend:** FastAPI, SQLite, SQLAlchemy.
- **Frontend:** HTML, Jinja2 Templates, Tailwind CSS (qua CDN).

## Cấu trúc thư mục (Folder Structure)
```text
fastapi_ecommerce/
├── app/
│   ├── main.py        # Điểm vào chính của ứng dụng
│   ├── database.py    # Cấu hình kết nối database
│   ├── models.py      # SQLAlchemy Models (Bảng CSDL)
│   ├── schemas.py     # Pydantic Schemas (Validation dữ liệu)
│   ├── crud.py        # Các thao tác CRUD database
│   ├── routers/       # Các file định tuyến API (Products, Cart, Admin)
│   │   ├── products.py
│   │   ├── cart.py
│   │   └── admin.py
│   └── templates/     # HTML Templates (Jinja2)
│       ├── base.html
│       ├── index.html
│       ├── admin.html
│       └── cart.html
├── requirements.txt   # Danh sách thư viện cần thiết
└── README.md
```

## Các bước chạy dự án
1. Tạo môi trường ảo (Virtual Environment): `python -m venv venv`
2. Kích hoạt môi trường: `venv\Scripts\activate` (trên Windows)
3. Cài đặt thư viện: `pip install -r requirements.txt`
4. Chạy server: `uvicorn app.main:app --reload`
