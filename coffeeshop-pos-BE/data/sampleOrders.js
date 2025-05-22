const sampleOrders = [
    // Tháng 1/2024
    {
        "employeeId": "682f78ec319c22fb68535fb1", // Nguyễn Ngọc Lan
        "customerId": "682f308d342560c6789e42e2",
        "tableId": "682f308d342560c6789e42e1",
        "items": [
            {
                "productId": "682b5eb1fe38cce75d09ae09", // Cà phê sữa đá
                "quantity": 2,
                "price": 25000,
                "total": 50000,
                "title": "Cà phê sữa đá",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747588258/milkcoffee_awuz8p.jpg"
            },
            {
                "productId": "682b5eb1fe38cce75d09ae0a", // Trà sữa trân châu
                "quantity": 1,
                "price": 30000,
                "total": 30000,
                "title": "Trà sữa trân châu",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747588258/milktea_zux3pe.jpg"
            }
        ],
        "totalAmount": 80000,
        "paymentMethod": "Tiền mặt",
        "status": "Đã thanh toán",
        "createdAt": new Date("2024-01-15T08:30:00.000Z"),
        "updatedAt": new Date("2024-01-15T08:30:00.000Z")
    },
    // Tháng 2/2024
    {
        "employeeId": "682f7963319c22fb68535fb9", // Nguyễn Văn Nam
        "customerId": "682f308d342560c6789e42e2",
        "tableId": "682f308d342560c6789e42e2",
        "items": [
            {
                "productId": "682b5eb1fe38cce75d09ae0b", // Bạc xỉu
                "quantity": 1,
                "price": 25000,
                "total": 25000,
                "title": "Bạc xỉu",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747670834/bacxiu_i2p4zq.jpg"
            },
            {
                "productId": "682b5eb1fe38cce75d09ae0c", // Cà phê sữa tươi
                "quantity": 2,
                "price": 28000,
                "total": 56000,
                "title": "Cà phê sữa tươi",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747670922/caphesuatuoi_ftvwhm.jpg"
            }
        ],
        "totalAmount": 81000,
        "paymentMethod": "Thẻ ngân hàng",
        "status": "Đã thanh toán",
        "createdAt": new Date("2024-02-20T14:15:00.000Z"),
        "updatedAt": new Date("2024-02-20T14:15:00.000Z")
    },
    // Tháng 3/2024
    {
        "employeeId": "682f78ec319c22fb68535fb1",
        "customerId": "682f308d342560c6789e42e2",
        "tableId": "682f308d342560c6789e42e3",
        "items": [
            {
                "productId": "682b5eb1fe38cce75d09ae0d", // Cà phê muối
                "quantity": 2,
                "price": 30000,
                "total": 60000,
                "title": "Cà phê muối",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747670922/caphemuoi_xlo7fv.jpg"
            },
            {
                "productId": "682b5eb1fe38cce75d09ae0f", // Trà sữa trà xanh
                "quantity": 1,
                "price": 30000,
                "total": 30000,
                "title": "Trà sữa trà xanh",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747588258/matcha_u9qieu.jpg"
            }
        ],
        "totalAmount": 90000,
        "paymentMethod": "Ví điện tử",
        "status": "Đã thanh toán",
        "createdAt": new Date("2024-03-10T16:45:00.000Z"),
        "updatedAt": new Date("2024-03-10T16:45:00.000Z")
    },
    // Tháng 4/2024
    {
        "employeeId": "682f7963319c22fb68535fb9",
        "customerId": "682f308d342560c6789e42e2",
        "tableId": "682f308d342560c6789e42e1",
        "items": [
            {
                "productId": "682b5eb1fe38cce75d09ae10", // Trà sữa khoai môn
                "quantity": 2,
                "price": 35000,
                "total": 70000,
                "title": "Trà sữa khoai môn",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747670924/taromilktea_fquskq.jpg"
            },
            {
                "productId": "682b5eb1fe38cce75d09ae11", // Nước ép cam
                "quantity": 1,
                "price": 25000,
                "total": 25000,
                "title": "Nước ép cam",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747588258/orangejuice_l724jw.jpg"
            }
        ],
        "totalAmount": 95000,
        "paymentMethod": "Tiền mặt",
        "status": "Đã thanh toán",
        "createdAt": new Date("2024-04-05T10:20:00.000Z"),
        "updatedAt": new Date("2024-04-05T10:20:00.000Z")
    },
    // Tháng 5/2024
    {
        "employeeId": "682f78ec319c22fb68535fb1",
        "customerId": "682f308d342560c6789e42e2",
        "tableId": "682f308d342560c6789e42e2",
        "items": [
            {
                "productId": "682b5eb1fe38cce75d09ae12", // Trà sữa Thái đỏ
                "quantity": 1,
                "price": 30000,
                "total": 30000,
                "title": "Trà sữa Thái đỏ",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747670925/trasuathaido_gic6ye.jpg"
            },
            {
                "productId": "682b5eb1fe38cce75d09ae13", // Sữa tươi trân châu
                "quantity": 2,
                "price": 40000,
                "total": 80000,
                "title": "Sữa tươi trân châu",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747670924/suatuoitranchauduongden_yfn79e.jpg"
            }
        ],
        "totalAmount": 110000,
        "paymentMethod": "Thẻ ngân hàng",
        "status": "Đã thanh toán",
        "createdAt": new Date("2024-05-01T15:30:00.000Z"),
        "updatedAt": new Date("2024-05-01T15:30:00.000Z")
    },
    // Tháng 6/2024
    {
        "employeeId": "682f7963319c22fb68535fb9",
        "customerId": "682f308d342560c6789e42e2",
        "tableId": "682f308d342560c6789e42e3",
        "items": [
            {
                "productId": "682b5eb1fe38cce75d09ae09", // Cà phê sữa đá
                "quantity": 3,
                "price": 25000,
                "total": 75000,
                "title": "Cà phê sữa đá",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747588258/milkcoffee_awuz8p.jpg"
            },
            {
                "productId": "682b5eb1fe38cce75d09ae0a", // Trà sữa trân châu
                "quantity": 2,
                "price": 30000,
                "total": 60000,
                "title": "Trà sữa trân châu",
                "thumbnail": "https://res.cloudinary.com/dwsywnjdj/image/upload/v1747588258/milktea_zux3pe.jpg"
            }
        ],
        "totalAmount": 135000,
        "paymentMethod": "Ví điện tử",
        "status": "Đã thanh toán",
        "createdAt": new Date("2024-06-15T09:45:00.000Z"),
        "updatedAt": new Date("2024-06-15T09:45:00.000Z")
    }
];

module.exports = sampleOrders; 