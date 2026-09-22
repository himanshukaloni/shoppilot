import QRCode from 'qrcode';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import Customer from '../models/Customer.js';
import StockMovement from '../models/StockMovement.js';
import Shop from '../models/Shop.js';

export async function createSale(req, res) {
  try {
    const {
      items,
      discount = 0,
      tax = 0,
      paymentMethod = 'CASH',
      customerId = null,
      customer = {}
    } = req.body;

    if (!Array.isArray(items) || !items.length) {
      throw new Error('Cart is empty');
    }

    let subtotal = 0;
    const final = [];

    // --------------------------------
    // Calculate sale items
    // --------------------------------
    for (const item of items) {
      const qty = Number(item.quantity);

      if (qty <= 0) {
        throw new Error('Invalid quantity');
      }

      const p = await Product.findOne({
        _id: item.productId,
        shopId: req.user.shopId
      });

      if (!p) {
        throw new Error('Product not found');
      }

      if (p.stock < qty) {
        throw new Error(`Insufficient stock for ${p.name}`);
      }

      const sub = p.sellingPrice * qty;
      const profit = (p.sellingPrice - p.purchasePrice) * qty;

      subtotal += sub;

      final.push({
        productId: p._id,
        productName: p.name,
        image: p.image?.url || '',
        quantity: qty,
        sellingPriceAtSale: p.sellingPrice,
        costPriceAtSale: p.purchasePrice,
        subtotal: sub,
        profit
      });
    }

    // --------------------------------
    // Customer snapshot
    // --------------------------------
    let customerSnapshot = {
      name: '',
      phone: '',
      address: ''
    };

    // Existing customer selected
    if (customerId) {
      const customerDoc = await Customer.findOne({
        _id: customerId,
        shopId: req.user.shopId
      });

      if (!customerDoc) {
        throw new Error('Customer not found');
      }

      customerSnapshot = {
        name: customerDoc.name || '',
        phone: customerDoc.phone || '',
        address: customerDoc.address || ''
      };
    }

    // New / manually entered customer
    else if (customer) {
      customerSnapshot = {
        name: customer.name?.trim() || '',
        phone: customer.phone?.trim() || '',
        address: customer.address?.trim() || ''
      };
    }

    // --------------------------------
    // Total
    // --------------------------------
    const total = Math.max(
      0,
      subtotal -
        Number(discount || 0) +
        Number(tax || 0)
    );

    // --------------------------------
    // Invoice number
    // --------------------------------
    const invoiceNumber =
      `INV-${new Date().getFullYear()}-${Date.now()
        .toString()
        .slice(-8)}`;

    // --------------------------------
    // Create sale
    // --------------------------------
    const sale = await Sale.create({
      shopId: req.user.shopId,

      invoiceNumber,

      customerId,

      customer: customerSnapshot,

      items: final,

      subtotal,

      discount: Number(discount || 0),

      tax: Number(tax || 0),

      total,

      paymentMethod,

      paymentStatus:
        paymentMethod === 'CREDIT'
          ? 'PENDING'
          : 'PAID'
    });

    // --------------------------------
    // Reduce stock
    // --------------------------------
    for (const item of items) {
      const p = await Product.findOne({
        _id: item.productId,
        shopId: req.user.shopId
      });

      const qty = Number(item.quantity);

      const old = p.stock;

      p.stock -= qty;

      await p.save();

      await StockMovement.create({
        shopId: req.user.shopId,
        productId: p._id,
        type: 'SALE',
        quantity: -qty,
        previousStock: old,
        newStock: p.stock,
        referenceId: String(sale._id),
        note: invoiceNumber
      });
    }

    // --------------------------------
    // Generate UPI QR
    // --------------------------------
    const shop = await Shop.findById(req.user.shopId);

    const upi =
      shop?.upiId ||
      process.env.UPI_ID;

    const qr = upi
      ? await QRCode.toDataURL(
          `upi://pay?pa=${encodeURIComponent(
            upi
          )}&pn=${encodeURIComponent(
            shop?.name ||
              process.env.SHOP_NAME ||
              'ShopPilot'
          )}&am=${sale.total.toFixed(
            2
          )}&cu=INR`
        )
      : null;

    // --------------------------------
    // Response
    // --------------------------------
    res.status(201).json({
      sale,
      shop,
      qr
    });

  } catch (e) {
    res.status(400).json({
      message: e.message
    });
  }
}

export async function listSales(req, res) {
  try {
    const sales = await Sale.find({
      shopId: req.user.shopId
    })
      .populate(
        'customerId',
        'name phone address'
      )
      .sort({
        createdAt: -1
      })
      .limit(500);

    res.json(sales);
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}