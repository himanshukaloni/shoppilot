import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Wallet
} from 'lucide-react';

import { api } from '../services/api';
import PageHead from '../components/common/PageHead';
import Stat from '../components/common/Stat';
import Loader from '../components/common/Loader';
import Empty from '../components/common/Empty';
import { money, dateTime } from '../utils/format';

export default function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/reports/summary')
      .then(setData)
      .catch(e => setError(e.message));
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!data) {
    return <Loader />;
  }

  return (
    <>
      <style>{`

        /* ================================
           REPORTS PAGE
        ================================= */

        .reports-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
        }

        .reports-page .dashboard-grid {
          width: 100%;
          min-width: 0;
        }

        .reports-page .card {
          min-width: 0;
          max-width: 100%;
        }

        /* ================================
           TABLE SCROLL AREA
        ================================= */

        .reports-page .table-scroll {
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;

          -webkit-overflow-scrolling: touch;

          scrollbar-width: thin;
        }

        /*
          IMPORTANT:
          Table is allowed to become wider than
          phone screen. Only .table-scroll moves.
        */

        .reports-page .table-scroll table {
          width: max-content;
          min-width: 650px;
          border-collapse: collapse;
        }

        .reports-page .table-scroll th,
        .reports-page .table-scroll td {
          white-space: nowrap;
        }

        /* ================================
           BUSINESS SNAPSHOT
        ================================= */

        .reports-page .insight {
          min-width: 0;
          overflow: hidden;
        }

        .reports-page .insight > div:last-child {
          min-width: 0;
        }

        .reports-page .insight p {
          white-space: normal;
          overflow-wrap: break-word;
          word-break: normal;
          line-height: 1.6;
        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 700px) {

          .reports-page {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          .reports-page .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .reports-page .card {
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }

          /*
            Tables get their own horizontal
            scrolling area.
          */

          .reports-page .table-scroll {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
          }

          .reports-page .table-scroll table {
            width: max-content;
            min-width: 680px;
          }

          .reports-page .table-scroll th,
          .reports-page .table-scroll td {
            white-space: nowrap;
            padding: 12px 14px;
          }

          /* Business snapshot stays wrapped */

          .reports-page .insight {
            display: flex;
            align-items: flex-start;
            gap: 14px;
          }

          .reports-page .insight > div:last-child {
            flex: 1;
            min-width: 0;
          }

          .reports-page .insight p {
            white-space: normal;
            overflow-wrap: break-word;
            word-break: normal;
          }
        }

      `}</style>

      <div className="reports-page">

        <PageHead
          eyebrow="ANALYTICS"
          title="Reports"
          subtitle="Real business numbers calculated from recorded transactions."
        />

        {/* STATS */}

        <div className="stats-grid">

          <Stat
            title="Revenue"
            value={money(data.revenue)}
            icon={TrendingUp}
          />

          <Stat
            title="Gross profit"
            value={money(data.grossProfit)}
            icon={BarChart3}
          />

          <Stat
            title="Purchases"
            value={money(data.purchaseSpend)}
            icon={ShoppingBag}
          />

          <Stat
            title="Net after expenses"
            value={money(data.netProfit)}
            icon={Wallet}
          />

        </div>

        {/* BEST PRODUCTS + BUSINESS SNAPSHOT */}

        <div className="dashboard-grid">

          {/* BEST SELLING PRODUCTS */}

          <section className="card table-card">

            <div className="section-head">
              <div>
                <h3>
                  Best-selling products
                </h3>

                <small>
                  Ranked by revenue
                </small>
              </div>
            </div>

            <div className="table-scroll">

              <table>

                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units</th>
                    <th>Revenue</th>
                    <th>Profit</th>
                  </tr>
                </thead>

                <tbody>

                  {data.bestProducts.map(p => (
                    <tr key={p.name}>

                      <td>
                        <b>{p.name}</b>
                      </td>

                      <td>
                        {p.units}
                      </td>

                      <td>
                        {money(p.revenue)}
                      </td>

                      <td>
                        {money(p.profit)}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

              {!data.bestProducts.length && (
                <Empty text="No sales data yet." />
              )}

            </div>

          </section>

          {/* BUSINESS SNAPSHOT */}

          <section className="card insight">

            <div className="stat-icon">
              <BarChart3 size={18} />
            </div>

            <div>

              <h3>
                Business snapshot
              </h3>

              <p>
                {data.products} products are currently
                registered. Gross profit is{' '}
                {money(data.grossProfit)} and recorded
                operating expenses are{' '}
                {money(data.expenseTotal)}.
              </p>

              <span className="tag">
                Live database report
              </span>

            </div>

          </section>

        </div>

        {/* LATEST SALES */}

        <section className="card table-card">

          <div className="section-head">

            <div>
              <h3>
                Latest sales
              </h3>

              <small>
                Last recorded transactions
              </small>
            </div>

          </div>

          <div className="table-scroll">

            <table>

              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>

                {data.sales
                  .slice()
                  .reverse()
                  .slice(0, 30)
                  .map(s => (
                    <tr key={s._id}>

                      <td>
                        {s.invoiceNumber}
                      </td>

                      <td>
                        {dateTime(s.createdAt)}
                      </td>

                      <td>
                        {s.paymentMethod}
                      </td>

                      <td>
                        <b>
                          {money(s.total)}
                        </b>
                      </td>

                    </tr>
                  ))}

              </tbody>

            </table>

            {!data.sales.length && (
              <Empty text="No sales recorded yet." />
            )}

          </div>

        </section>

      </div>
    </>
  );
}