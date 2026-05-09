Chứa business logic.

Ví dụ:

xử lý login
hash password
tính toán
gọi database

Controller chỉ nên gọi service.

Ví dụ:
const user = await authService.login(email, password)