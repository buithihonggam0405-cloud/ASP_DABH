from pydantic import BaseModel
from typing import Optional

# -- Product Schemas --
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = "https://via.placeholder.com/150"
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

# -- Cart Schemas --
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    product: Product # Thông tin chi tiết sản phẩm dựa vào quan hệ DB

    class Config:
        from_attributes = True
