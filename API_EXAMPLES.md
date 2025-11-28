# 🧪 API Testing Examples

## 🔐 Authentication

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@heencoffee.com",
    "password": "admin"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@heencoffee.com",
      "role": "admin"
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Save the token for subsequent requests!**

---

## 📦 Categories

### Get All Categories
```bash
curl -X GET http://localhost:8000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Category
```bash
curl -X POST http://localhost:8000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Smoothies",
    "description": "Fresh fruit smoothies",
    "sort_order": 6
  }'
```

---

## ☕ Products

### Get All Products
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filter by Category
```bash
curl -X GET "http://localhost:8000/api/products?category_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Products
```bash
curl -X GET "http://localhost:8000/api/products?search=latte" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Product
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category_id": 1,
    "name": "Flat White",
    "description": "Smooth espresso with microfoam",
    "price": 5.50,
    "has_temperature": true,
    "has_size": true,
    "topping_ids": [1, 2, 3]
  }'
```

---

## 🍰 Toppings

### Get All Toppings
```bash
curl -X GET http://localhost:8000/api/toppings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Topping
```bash
curl -X POST http://localhost:8000/api/toppings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Hazelnut Syrup",
    "price": 0.60
  }'
```

---

## 🛒 Orders

### Get All Orders
```bash
curl -X GET http://localhost:8000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filter by Status
```bash
curl -X GET "http://localhost:8000/api/orders?status=completed" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Order
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user_id": 1,
    "order_type": "dine-in",
    "payment_method": "cash",
    "items": [
      {
        "product_id": 1,
        "size": "Large",
        "temperature": "Hot",
        "quantity": 2,
        "toppings": [
          {"id": 1},
          {"id": 2}
        ]
      },
      {
        "product_id": 2,
        "size": "Small",
        "temperature": "Cold",
        "quantity": 1,
        "toppings": []
      }
    ]
  }'
```

### Create Order with Discount
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user_id": 1,
    "order_type": "take-away",
    "payment_method": "card",
    "discount_type": "percentage",
    "discount_value": 10,
    "note": "Extra hot please",
    "items": [
      {
        "product_id": 1,
        "size": "Large",
        "temperature": "Hot",
        "quantity": 1,
        "toppings": []
      }
    ]
  }'
```

---

## 📊 Analytics

### Get Sales Analytics
```bash
curl -X GET http://localhost:8000/api/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### With Date Range
```bash
curl -X GET "http://localhost:8000/api/analytics?date_from=2024-01-01&date_to=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📦 Inventory

### Get All Inventory
```bash
curl -X GET http://localhost:8000/api/inventory \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filter by Category
```bash
curl -X GET "http://localhost:8000/api/inventory?category=Ingredients" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Low Stock Alerts
```bash
curl -X GET http://localhost:8000/api/inventory/alerts/low-stock \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Inventory Item
```bash
curl -X POST http://localhost:8000/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Honey",
    "category": "Ingredients",
    "stock": 5.5,
    "unit": "kg",
    "low_stock_threshold": 3,
    "auto_deduct": true
  }'
```

### Adjust Stock (Add)
```bash
curl -X POST http://localhost:8000/api/inventory/1/adjust \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "addition",
    "quantity": 10,
    "reason": "New shipment received"
  }'
```

### Adjust Stock (Deduct)
```bash
curl -X POST http://localhost:8000/api/inventory/1/adjust \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "deduction",
    "quantity": 2.5,
    "reason": "Used for orders"
  }'
```

---

## 💡 Tips

### Save Token as Variable (Bash)
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@heencoffee.com","password":"admin"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo $TOKEN
```

Then use it:
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer $TOKEN"
```

### Pretty Print JSON (with jq)
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🧪 Testing Workflow

1. **Login** and save token
2. **Get categories** to see available categories
3. **Get products** to see what's in stock
4. **Create an order** with products and toppings
5. **Check analytics** to see sales data
6. **Check inventory** for low stock items

---

## 📱 Using with Postman

1. Import these as a collection
2. Create an environment variable `token`
3. Set the token after login
4. Use `{{token}}` in Authorization header

---

**Happy Testing! 🚀**
