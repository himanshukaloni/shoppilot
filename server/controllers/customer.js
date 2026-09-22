import Customer from '../models/Customer.js';
import Sale from '../models/Sale.js';

export async function list(req, res) {
  try {
    const customers = await Customer.find({
      shopId: req.user.shopId
    }).sort({
      createdAt: -1
    });

    res.json(customers);
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}

export async function create(req, res) {
  try {
    const {
      name,
      phone = '',
      email = '',
      address = '',
      openingDue = 0
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: 'Customer name is required'
      });
    }

    const customer = await Customer.create({
      shopId: req.user.shopId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      openingDue: Number(openingDue || 0)
    });

    res.status(201).json(customer);
  } catch (e) {
    res.status(400).json({
      message: e.message
    });
  }
}

export async function update(req, res) {
  try {
    const {
      name,
      phone = '',
      email = '',
      address = '',
      openingDue = 0
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: 'Customer name is required'
      });
    }

    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        shopId: req.user.shopId
      },
      {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        openingDue: Number(openingDue || 0)
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    res.json(customer);
  } catch (e) {
    res.status(400).json({
      message: e.message
    });
  }
}

export async function remove(req, res) {
  try {
    await Customer.deleteOne({
      _id: req.params.id,
      shopId: req.user.shopId
    });

    res.json({
      message: 'Customer deleted'
    });
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}

export async function history(req, res) {
  try {
    const sales = await Sale.find({
      shopId: req.user.shopId,
      customerId: req.params.id
    })
      .sort({
        createdAt: -1
      })
      .limit(100);

    res.json(sales);
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}