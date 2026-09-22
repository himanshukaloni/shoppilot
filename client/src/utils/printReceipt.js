export function printReceipt({ sale, shop, qr }) {
  if (!sale) return;

  const win = window.open(
    '',
    '_blank',
    'width=480,height=760'
  );

  if (!win) {
    alert(
      'Allow pop-ups to print the receipt.'
    );
    return;
  }

  const esc = v =>
    String(v ?? '').replace(
      /[&<>"']/g,
      c =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }[c])
    );

  const items = (sale.items || [])
    .map(
      i => `
        <div class="item">
          <div>
            <b>${esc(i.productName)}</b>
            <span>
              ${i.quantity} × ₹${Number(
                i.sellingPriceAtSale || 0
              ).toFixed(2)}
            </span>
          </div>

          <strong>
            ₹${Number(
              i.subtotal || 0
            ).toFixed(2)}
          </strong>
        </div>
      `
    )
    .join('');

  /*
   * Customer information
   *
   * New sales:
   * sale.customer
   *
   * Older sales:
   * sale.customerId
   */
  const customer = sale.customer || {};

  const hasCustomer =
    customer.name ||
    customer.phone ||
    customer.address;

  const customerBlock = hasCustomer
    ? `
      <div class="customer">
        <div class="customer-title">
          BILL TO
        </div>

        ${
          customer.name
            ? `<div class="customer-name">
                ${esc(customer.name)}
              </div>`
            : ''
        }

        ${
          customer.phone
            ? `<div class="customer-line">
                Phone: ${esc(customer.phone)}
              </div>`
            : ''
        }

        ${
          customer.address
            ? `<div class="customer-line">
                Address: ${esc(customer.address)}
              </div>`
            : ''
        }
      </div>

      <div class="line"></div>
    `
    : '';

  win.document.write(`
    <!doctype html>

    <html>
      <head>
        <title>
          ${esc(sale.invoiceNumber)}
        </title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #fff;
            font-family: Arial, sans-serif;
            color: #171717;
          }

          .receipt {
            width: 80mm;
            margin: 0 auto;
            padding: 18px;
          }

          .center {
            text-align: center;
          }

          .brand {
            font-size: 20px;
            font-weight: 800;
          }

          .muted {
            font-size: 11px;
            color: #777;
            margin-top: 3px;
          }

          .line {
            border-top: 1px dashed #aaa;
            margin: 12px 0;
          }

          .row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            font-size: 12px;
            margin: 6px 0;
          }

          .item {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin: 10px 0;
            font-size: 12px;
          }

          .item b,
          .item span {
            display: block;
          }

          .item span {
            font-size: 11px;
            color: #777;
            margin-top: 3px;
          }

          .customer {
            margin-top: 4px;
          }

          .customer-title {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #777;
            margin-bottom: 6px;
          }

          .customer-name {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .customer-line {
            font-size: 11px;
            color: #555;
            line-height: 1.5;
          }

          .total {
            font-size: 17px;
            font-weight: 800;
          }

          .qr {
            text-align: center;
            margin: 18px 0 6px;
          }

          .qr img {
            width: 145px;
            height: 145px;
          }

          .thanks {
            text-align: center;
            font-size: 11px;
            margin-top: 18px;
            font-weight: 600;
          }

          @media print {
            body {
              width: 80mm;
            }

            .receipt {
              padding: 8px;
            }
          }
        </style>
      </head>

      <body>

        <main class="receipt">

          <!-- SHOP -->
          <div class="center">
            <div class="brand">
              ${esc(
                shop?.name ||
                  'ShopPilot Store'
              )}
            </div>

            <div class="muted">
              ${esc(shop?.address || '')}
            </div>

            <div class="muted">
              ${esc(shop?.phone || '')}
            </div>
          </div>

          <div class="line"></div>

          <!-- INVOICE -->
          <div class="row">
            <span>Invoice</span>
            <b>
              ${esc(sale.invoiceNumber)}
            </b>
          </div>

          <div class="row">
            <span>Date</span>

            <span>
              ${new Date(
                sale.createdAt
              ).toLocaleString('en-IN')}
            </span>
          </div>

          <div class="line"></div>

          <!-- CUSTOMER -->
          ${customerBlock}

          <!-- ITEMS -->
          ${items}

          <div class="line"></div>

          <!-- TOTALS -->
          <div class="row">
            <span>Subtotal</span>

            <span>
              ₹${Number(
                sale.subtotal || 0
              ).toFixed(2)}
            </span>
          </div>

          <div class="row">
            <span>Discount</span>

            <span>
              ₹${Number(
                sale.discount || 0
              ).toFixed(2)}
            </span>
          </div>

          <div class="row">
            <span>Tax</span>

            <span>
              ₹${Number(
                sale.tax || 0
              ).toFixed(2)}
            </span>
          </div>

          <div class="line"></div>

          <div class="row total">
            <span>TOTAL</span>

            <span>
              ₹${Number(
                sale.total || 0
              ).toFixed(2)}
            </span>
          </div>

          <div class="row">
            <span>Payment</span>

            <b>
              ${esc(sale.paymentMethod)}
            </b>
          </div>

          <!-- QR -->
          ${
            qr
              ? `
                <div class="qr">
                  <img src="${qr}" />

                  <div class="muted">
                    Scan to pay ₹${Number(
                      sale.total || 0
                    ).toFixed(2)}
                  </div>
                </div>
              `
              : ''
          }

          <div class="thanks">
            Thank you for shopping with us!
          </div>

        </main>

        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 250);
          };
        </script>

      </body>
    </html>
  `);

  win.document.close();
}